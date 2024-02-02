import { Subnet, Vpc } from "aws-cdk-lib/aws-ec2";
import { Cluster, ContainerImage } from "aws-cdk-lib/aws-ecs";
import { ApplicationLoadBalancedFargateService } from "aws-cdk-lib/aws-ecs-patterns";

import { Duration, Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import * as cdk from "aws-cdk-lib";

export class AlbEcsFargateStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const vpc = Vpc.fromLookup(this, "ImportVpc", {
      isDefault: true,
      vpcId: "vpc-3306b84e",
    });

    const cluster = new Cluster(this, "MessagesCluster", {
      vpc: vpc,
    });

    new ApplicationLoadBalancedFargateService(this, "MessagesFargateService", {
      assignPublicIp: true,
      cluster: cluster,
      desiredCount: 1,
      memoryLimitMiB: 1024,
      cpu: 512,
      taskImageOptions: {
        image: ContainerImage.fromRegistry("amazon/amazon-ecs-sample"),
      },
      // taskSubnets: {
      //   subnets: [
      //     Subnet.fromSubnetId(
      //       this,
      //       "subnet",
      //       "VpcISOLATEDSubnet1Subnet80F07FA0"
      //     ),
      //   ],
      // },
      loadBalancerName: "application-lb-name",
    });
  }
}
