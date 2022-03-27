import { App, CfnOutput, Stack, StackProps } from 'aws-cdk-lib';
import { LambdaRestApi } from 'aws-cdk-lib/aws-apigateway';
import { LayerVersion, Tracing } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';

class LambdaGateway extends Stack {
  constructor(scope?: App, id?: string, props?: StackProps) {
    super(scope, id, props);

    const layer = LayerVersion.fromLayerVersionArn(
      this,
      'otel',
      `arn:aws:lambda:${this.region}:901920570463:layer:aws-otel-nodejs-amd64-ver-1-0-1:2`,
    );

    const lambda = new NodejsFunction(this, 'Lamba', {
      entry: './build/src/handler.js',
      memorySize: 1024,
      layers: [layer],
      environment: { AWS_LAMBDA_EXEC_WRAPPER: '/opt/otel-handler' },
      tracing: Tracing.ACTIVE,
    });

    const api = new LambdaRestApi(this, 'Api', { handler: lambda });

    new CfnOutput(this, 'ApiUrl', { value: api.url });
  }
}

const app = new App();
new LambdaGateway(app, 'LambdaGateway', { env: { region: 'ap-southeast-2' } });
