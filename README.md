# RNS-SERVER

## Setup AWS Credentials

1. [Sign up for an AWS account](https://serverless.com/framework/docs/providers/aws/guide/credentials#sign-up-for-an-aws-account)

2. Login to your AWS account and go to the **Identity & Access Management (IAM)** page.

3. Click on **Users** and then **Add user**. Enter a name in the first field to remind you this User is related to the Serverless Framework, like `serverless-admin`. Enable **Programmatic access** by clicking the checkbox. Click **Next** to go through to the Permissions page. Click on **Attach existing policies directly**. Search for and select **AdministratorAccess** then click **Next: Review**. Check to make sure everything looks good and click **Create user**.

4. View and copy the **API Key & Secret** to a temporary place. You'll need it in the next step.

## Setup Workstation

Install AWS CLI

- Windows: `choco install awscli`
- MacOS: `brew install awscli`

Config AWS CLI

```bash
$ aws configure

AWS Access Key ID [****************TKYQ]:
AWS Secret Access Key [****************yNO2]:
Default region name [us-east-1]:
Default output format [None]:
```

> Please enter your **AWS Access Key ID**, **AWS Secret Access Key** and **Default region name**

## Deployment

```bash
# deploy to AWS
$ npm run deploy:prod
```

> If you're using multiple AWS profiles, use the `--aws-profile`` option.

```bash
$ npx sls deploy -s prod --aws-profile YOUR_PROFILE
```

## Local Offline Development

```bash
# start serverless-offline server
$ npm run sls:offline

```

## Local NestJS Development - (Optional)

```bash
# start local nestjs server
$ npm start


# start local nestjs server in watch mode
$ npm run start:debug
```