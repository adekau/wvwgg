import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import route53 = cdk.aws_route53;
import acm = cdk.aws_certificatemanager;

interface DnsStackProps extends cdk.StackProps {
    baseDomainName: string;
}

export class DnsStack extends cdk.Stack {
    public readonly zone: route53.HostedZone;
    public readonly certificate: acm.Certificate;

    constructor(scope: Construct, id: string, props: DnsStackProps) {
        super(scope, id, props);

        // DNS Zone for the domain name. 
        // Name servers generated need to be added to the domain registrar.
        this.zone = new route53.HostedZone(this, 'WvWGGCloudFrontHostedZone', {
            zoneName: props.baseDomainName,
            comment: 'WvWGG CloudFront Hosted Zone'
        });

        // ACM Certificate for the domain name.
        // Uses DNS validation, the domain name provided needs to match the domain name in the zone in order to validate.
        this.certificate = new acm.Certificate(this, 'WvWGGCloudFrontCertificate', {
            domainName: `*.${props.baseDomainName}`,
            validation: acm.CertificateValidation.fromDns(this.zone),
            subjectAlternativeNames: [props.baseDomainName, `www.${props.baseDomainName}`]
        });

        new route53.CnameRecord(this, 'WvWGGwwwRedirectRecord', {
            zone: this.zone,
            comment: 'Redirect www to non-www',
            domainName: props.baseDomainName,
            recordName: 'www'
        });
    }
}