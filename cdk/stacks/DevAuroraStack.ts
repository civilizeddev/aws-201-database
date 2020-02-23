import * as cdk from '@aws-cdk/core'
import * as ec2 from '@aws-cdk/aws-ec2'
import * as rds from '@aws-cdk/aws-rds'
import * as iam from '@aws-cdk/aws-iam'

const MYSQL_CLIENT_USERDATA = [
  'yum update -y',
  'yum install java-1.7.0-openjdk* -y',
  'yum install mysql -y',
  'yum install libtool mysql-devel -y',
  'yum install mysql-connector-java -y',
  'echo net.ipv4.tcp_keepalive_intvl = 5 >> /etc/sysctl.conf',
  'echo net.ipv4.tcp_keepalive_probes = 3 >> /etc/sysctl.conf',
  'echo net.ipv4.ip_default_ttl  = 30 >> /etc/sysctl.conf',
  'mv /etc/my.cnf /tmp',
  'head -9 /tmp/my.cnf >> /etc/my.cnf',
  'echo interactive_timeout=5 >> /etc/my.cnf',
  'tail -4 /tmp/my.cnf >> /etc/my.cnf',
  'sysctl -p /etc/sysctl.conf',
  'rm -rf /etc/localtime',
  'ln -s /usr/share/zoneinfo/Asia/Seoul /etc/localtime',
]

export class DevAuroraStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string) {
    super(scope, id)

    const myVPC = new ec2.Vpc(this, 'myVPC', {
      maxAzs: 2,
    })

    const MySQLClientSecurityGroup = new ec2.SecurityGroup(
      this,
      'MySQLClientSecurityGroup',
      {
        securityGroupName: 'MySQLClientSecurityGroup',
        vpc: myVPC,
      },
    )

    const userData = ec2.UserData.forLinux()
    userData.addCommands(...MYSQL_CLIENT_USERDATA)

    const MySQLClientInstanceRole = new iam.Role(
      this,
      'MySQLClientInstance-Role',
      {
        assumedBy: new iam.ServicePrincipal('ec2.amazonaws.com'),
        managedPolicies: [
          iam.ManagedPolicy.fromAwsManagedPolicyName(
            'AmazonSSMManagedInstanceCore',
          ),
        ],
      },
    )

    const MySQLClientInstance = new ec2.Instance(this, 'MySQLClientInstance', {
      instanceName: 'MySQLClientInstance',
      instanceType: ec2.InstanceType.of(
        ec2.InstanceClass.T2,
        ec2.InstanceSize.MICRO,
      ),
      machineImage: new ec2.AmazonLinuxImage({
        generation: ec2.AmazonLinuxGeneration.AMAZON_LINUX_2,
      }),
      role: MySQLClientInstanceRole,
      securityGroup: MySQLClientSecurityGroup,
      userData,
      vpc: myVPC,
    })

    const RDSSecurityGroup = new ec2.SecurityGroup(this, 'RDSSecurityGroup', {
      securityGroupName: 'RDSSecurityGroup',
      vpc: myVPC,
    })
    RDSSecurityGroup.addIngressRule(
      MySQLClientSecurityGroup,
      ec2.Port.tcp(3306),
    )

    const clusterParameterGroup = new rds.ClusterParameterGroup(
      this,
      'ClusterParameterGroup',
      {
        family: 'aurora-mysql5.7',
        parameters: {
          character_set_database: 'utf8mb4',
        },
      },
    )

    const auroraCluster = new rds.DatabaseCluster(this, 'aurora-57-clu', {
      clusterIdentifier: 'aurora-57-clu',
      engine: rds.DatabaseClusterEngine.AURORA_MYSQL,
      instanceProps: {
        instanceType: ec2.InstanceType.of(
          ec2.InstanceClass.R5,
          ec2.InstanceSize.LARGE,
        ),
        securityGroup: RDSSecurityGroup,
        vpc: myVPC,
      },
      instances: 1,
      masterUser: {
        username: 'admin',
      },
      parameterGroup: clusterParameterGroup,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    })
  }
}
