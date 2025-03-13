import { BailErrorStrategy, CommonTokenStream } from "antlr4ts";
import { ApexLexer, ApexParser } from "apex-parser";
import { CaseInsensitiveInputStream } from "apex-parser/lib/CaseInsensitiveInputStream";
import { expect } from "chai";
import { parseXml } from "libxmljs";
import { describe } from "mocha";
import * as apex from "../../../src/utils/apex";
import { writeFileSync } from "fs";

const getApexParser = (apexCode) => {
  const lexer = new ApexLexer(new CaseInsensitiveInputStream(null, apexCode));
  const tokens = new CommonTokenStream(lexer);
  const parser = new ApexParser(tokens);
  parser.errorHandler = new BailErrorStrategy();
  return parser;
};

const validateApexClass = (apexClassCode) => {
  const parser = getApexParser(apexClassCode);
  return parser.compilationUnit();
};

const validateApexTrigger = (apexTriggerCode) => {
  const parser = getApexParser(apexTriggerCode);
  return parser.triggerUnit();
};

describe("Apex code utils", function () {
  it("webhook callout generator should generate valid Apex code", function () {
    const secretToken = "some-secret-token";
    const { body: result } = apex.getWebhookCallout(secretToken);
    validateApexClass(result);
  });

  it("webhook callout mock generator should generate valid Apex code", function () {
    const { body: result } = apex.getWebhookCalloutMock();
    validateApexClass(result);
  });

  it("SObject factory generator should generate valid Apex code", function () {
    const { body: result } = apex.getSObjectFactory();
    validateApexClass(result);
  });

  it("trigger generator for new objects should generate valid Apex code", function () {
    const template = require("../../../resources/templates/apex/src/NewSObject.trigger.handlebars");
    const endpointUrl = "https://example.com";
    const sObjectType = "SomeType";
    const webhookCalloutMock = apex.getWebhookCalloutMock();
    const { body: result } = apex.getWebhookTrigger(
      template,
      webhookCalloutMock,
      {
        endpointUrl,
        sObjectType,
      },
    );
    validateApexTrigger(result);
  });

  it("trigger test generator for new objects should generate valid Apex code", function () {
    const template = require("../../../resources/templates/apex/test/NewSObjectTriggerTest.cls.handlebars");
    const endpointUrl = "https://example.com";
    const sObjectType = "SomeType";
    const sObjectFactory = apex.getSObjectFactory();
    const webhookCalloutMock = apex.getWebhookCalloutMock();
    const { body: result } = apex.getWebhookTriggerTest(
      template,
      webhookCalloutMock,
      sObjectFactory,
      {
        endpointUrl,
        sObjectType,
      },
    );
    validateApexClass(result);
  });

  it("trigger generator for new ChangeEvent objects should generate valid Apex code", function () {
    const template = require("../../../resources/templates/apex/src/NewChangeEvent.trigger.handlebars");
    const endpointUrl = "https://example.com";
    const associateParentEntity = "SomeType";
    const sObjectType = `${associateParentEntity}ChangeEvent`;
    const webhookCalloutMock = apex.getWebhookCalloutMock();
    const { body: result } = apex.getWebhookTrigger(
      template,
      webhookCalloutMock,
      {
        endpointUrl,
        sObjectType,
        associateParentEntity,
      },
    );
    validateApexTrigger(result);
  });

  it("trigger generator for updated objects should generate valid Apex code", function () {
    const template = require("../../../resources/templates/apex/src/UpdatedSObject.trigger.handlebars");
    const endpointUrl = "https://example.com";
    const sObjectType = "SomeType";
    const webhookCalloutMock = apex.getWebhookCalloutMock();
    const { body: result } = apex.getWebhookTrigger(
      template,
      webhookCalloutMock,
      {
        endpointUrl,
        sObjectType,
      },
    );
    validateApexTrigger(result);
  });

  it("trigger test generator for updated objects should generate valid Apex code", function () {
    const template = require("../../../resources/templates/apex/test/UpdatedSObjectTriggerTest.cls.handlebars");
    const endpointUrl = "https://example.com";
    const sObjectType = "SomeType";
    const sObjectFactory = apex.getSObjectFactory();
    const webhookCalloutMock = apex.getWebhookCalloutMock();
    const { body: result } = apex.getWebhookTriggerTest(
      template,
      webhookCalloutMock,
      sObjectFactory,
      {
        endpointUrl,
        sObjectType,
      },
    );
    validateApexClass(result);
  });

  it("trigger generator for any of the updated fields in objects should generate valid Apex code", function () {
    const template = require("../../../resources/templates/apex/src/UpdatedAnyOfSObjectFields.trigger.handlebars");
    const endpointUrl = "https://example.com";
    const sObjectType = "SomeType";
    const fieldsToCheck = ["Name", "Email"];
    const webhookCalloutMock = apex.getWebhookCalloutMock();
    const { body: result } = apex.getWebhookTrigger(
      template,
      webhookCalloutMock,
      {
        endpointUrl,
        sObjectType,
        fieldsToCheck,
      },
    );
    validateApexTrigger(result);
  });

  it("trigger test generator for any of the updated fields in objects should generate valid Apex code", function () {
    const template = require("../../../resources/templates/apex/test/UpdatedAnyOfSObjectFieldsTriggerTest.cls.handlebars");
    const endpointUrl = "https://example.com";
    const sObjectType = "SomeType";
    const fieldsToCheck = ["Name", "Email"];
    const sObjectFactory = apex.getSObjectFactory();
    const webhookCalloutMock = apex.getWebhookCalloutMock();
    const { body: result } = apex.getWebhookTriggerTest(
      template,
      webhookCalloutMock,
      sObjectFactory,
      {
        endpointUrl,
        sObjectType,
        fieldsToCheck,
      },
    );
    validateApexClass(result);
  });

  it("trigger generator for all of the updated fields in objects should generate valid Apex code", function () {
    const template = require("../../../resources/templates/apex/src/UpdatedAllOfSObjectFields.trigger.handlebars");
    const endpointUrl = "https://example.com";
    const sObjectType = "SomeType";
    const fieldsToCheck = ["Name", "Email"];
    const webhookCalloutMock = apex.getWebhookCalloutMock();
    const { body: result } = apex.getWebhookTrigger(
      template,
      webhookCalloutMock,
      {
        endpointUrl,
        sObjectType,
        fieldsToCheck,
      },
    );
    validateApexTrigger(result);
  });

  it("trigger test generator for all of the updated fields in objects should generate valid Apex code", function () {
    const template = require("../../../resources/templates/apex/test/UpdatedAllOfSObjectFieldsTriggerTest.cls.handlebars");
    const endpointUrl = "https://example.com";
    const sObjectType = "SomeType";
    const fieldsToCheck = ["Name", "Email"];
    const sObjectFactory = apex.getSObjectFactory();
    const webhookCalloutMock = apex.getWebhookCalloutMock();
    const { body: result } = apex.getWebhookTriggerTest(
      template,
      webhookCalloutMock,
      sObjectFactory,
      {
        endpointUrl,
        sObjectType,
        fieldsToCheck,
      },
    );
    validateApexClass(result);
  });

  it("trigger test generator for deleted objects should generate valid Apex code", function () {
    const template = require("../../../resources/templates/apex/test/DeletedSObjectTriggerTest.cls.handlebars");
    const endpointUrl = "https://example.com";
    const sObjectType = "SomeType";
    const sObjectFactory = apex.getSObjectFactory();
    const webhookCalloutMock = apex.getWebhookCalloutMock();
    const { body: result } = apex.getWebhookTriggerTest(
      template,
      webhookCalloutMock,
      sObjectFactory,
      {
        endpointUrl,
        sObjectType,
      },
    );
    validateApexClass(result);
  });

  it("trigger test generator for deleted objects should generate valid Apex code", function () {
    const template = require("../../../resources/templates/apex/test/DeletedSObjectTriggerTest.cls.handlebars");
    const endpointUrl = "https://example.com";
    const sObjectType = "SomeType";
    const sObjectFactory = apex.getSObjectFactory();
    const webhookCalloutMock = apex.getWebhookCalloutMock();
    const { body: result } = apex.getWebhookTriggerTest(
      template,
      webhookCalloutMock,
      sObjectFactory,
      {
        endpointUrl,
        sObjectType,
      },
    );
    validateApexClass(result);
  });
});

describe("SOAP request utils", function () {
  it("deploy request generator should generate a valid request", function () {
    const secretToken = "some-secret-token";
    const classes = [
      apex.getWebhookCallout(secretToken),
      apex.getWebhookCalloutMock(),
    ];

    const template = require("../../../resources/templates/apex/src/NewSObject.trigger.handlebars");
    const endpointUrl = "https://example.com";
    const sObjectType = "SomeType";
    const webhookCalloutMock = apex.getWebhookCalloutMock();
    const trigger = apex.getWebhookTrigger(template, webhookCalloutMock, {
      endpointUrl,
      sObjectType,
    });
    const triggers = [trigger];
    const authToken = "some-token";

    const { body: requestBody } = apex.getDeployApexCodeBody(
      authToken,
      classes,
      triggers,
    );

    const result = parseXml(requestBody);
    expect(result.errors.length).to.equal(0);
  });

  it("delete request generator should generate a valid request", function () {
    const secretToken = "some-secret-token";
    const classes = [
      apex.getWebhookCallout(secretToken),
      apex.getWebhookCalloutMock(),
    ];

    const template = require("../../../resources/templates/apex/src/NewSObject.trigger.handlebars");
    const endpointUrl = "https://example.com";
    const sObjectType = "SomeType";
    const webhookCalloutMock = apex.getWebhookCalloutMock();
    const trigger = apex.getWebhookTrigger(template, webhookCalloutMock, {
      endpointUrl,
      sObjectType,
    });
    const triggers = [trigger];
    const authToken = "some-token";

    const { body: requestBody } = apex.getDeployApexCodeBody(
      authToken,
      classes.map((i) => i.name),
      triggers.map((i) => i.name),
    );

    const result = parseXml(requestBody);
    expect(result.errors.length).to.equal(0);
  });

  it("should generate valid XML when Apex code contains XML special characters", function () {
    // Create a class with XML special characters
    const classWithSpecialChars = {
      name: "TestClass",
      body: `public class TestClass {
        // The following line has XML special characters < > & ' "
        if (x < 10 && y > 20) {
            String s = 'apostrophe & ampersand " quotes';
        }
      }`
    };
    
    const triggerWithSpecialChars = {
      name: "TestTrigger",
      body: `trigger TestTrigger on Account (before insert) {
        // The following line has XML special characters < > & ' "
        if (Trigger.new[0].Name != null && Trigger.new[0].Name.length() > 0) {
            String s = 'some string with <xml> & special "characters"';
        }
      }`
    };
    
    const authToken = "auth-token-value";
    
    const { body: requestBody } = apex.getDeployApexCodeBody(
      authToken,
      [classWithSpecialChars],
      [triggerWithSpecialChars]
    );
    
    // This should not throw an error if XML is valid
    const result = parseXml(requestBody);
    expect(result.errors.length).to.equal(0);
    
    // Save the generated SOAP message to a file for external validation
    const outputPath = '/home/muly/fork-salesforce-webhooks/test/output/sample-soap-message.xml';
    writeFileSync(outputPath, requestBody);
    console.log(`SOAP message saved to: ${outputPath}`);
    
    // Verify that the XML special characters are properly escaped
    // Note that characters are double-escaped due to how XML handling works
    expect(requestBody).to.include("&amp;lt;");
    expect(requestBody).to.include("&amp;gt;");
    expect(requestBody).to.include("&amp;amp;");
    expect(requestBody).to.include("&amp;apos;");
    expect(requestBody).to.include("&amp;quot;");
  });
  
  it("should generate valid XML with CDATA-like content", function () {
    // Create a class with CDATA-like content that could cause issues
    const classWithCDATALike = {
      name: "CDATATestClass",
      body: `public class CDATATestClass {
        // The following contains CDATA-like content that could break XML
        String cdataExample = '<![CDATA[ This is CDATA content with nested <tags> & special chars ]]>';
        
        // Processing instruction-like content
        String piExample = '<?xml version="1.0" encoding="UTF-8"?>';
        
        // Comment-like content
        String commentExample = '<!-- XML comment that could break parsing -->';
      }`
    };
    
    const authToken = "auth-token-value";
    
    const { body: requestBody } = apex.getDeployApexCodeBody(
      authToken,
      [classWithCDATALike],
      []
    );
    
    // This should not throw an error if XML is valid
    const result = parseXml(requestBody);
    expect(result.errors.length).to.equal(0);
    
    // Save the generated SOAP message to a file for external validation
    const outputPath = '/home/muly/fork-salesforce-webhooks/test/output/cdata-soap-message.xml';
    writeFileSync(outputPath, requestBody);
    console.log(`CDATA SOAP message saved to: ${outputPath}`);
  });
  
  it("should generate valid XML with extreme XML-breaking content", function () {
    // Create a class with content specifically designed to break XML parsers
    const classWithExtreme = {
      name: "ExtremeTestClass",
      body: `public class ExtremeTestClass {
        // A mixture of XML breaking patterns
        String mixture = '<![CDATA[</tags>]]> && <<< >>> "quote" \'apostrophe\' & ampersand';
        
        // XML entity-like content
        String entityExample = '&lt; &gt; &amp; &quot; &apos; &#x3C; &#60;';
        
        // Deeply nested tags in a string
        String nestedTags = '<a><b><c><d><e><f><g>nested</g></f></e></d></c></b></a>';
        
        // Malformed tag-like content
        String malformedTags = '< not-a-tag > </ also-not-a-tag >';
        
        // Unclosed tags
        String unclosedTags = '<unclosed tag and <another unclosed';
      }`
    };
    
    const authToken = "auth-token-value";
    
    const { body: requestBody } = apex.getDeployApexCodeBody(
      authToken,
      [classWithExtreme],
      []
    );
    
    // This should not throw an error if XML is valid
    const result = parseXml(requestBody);
    expect(result.errors.length).to.equal(0);
    
    // Save the generated SOAP message to a file for external validation
    const outputPath = '/home/muly/fork-salesforce-webhooks/test/output/extreme-soap-message.xml';
    writeFileSync(outputPath, requestBody);
    console.log(`Extreme SOAP message saved to: ${outputPath}`);
  });
});
