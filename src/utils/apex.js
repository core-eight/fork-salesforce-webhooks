import { getRandomName, escapeXml } from "./common.js";
import webhookCalloutTemplate from "../../resources/templates/apex/src/WebhookCallout.cls.handlebars";
import httpCalloutMockTemplate from "../../resources/templates/apex/test/HttpCalloutMock.cls.handlebars";
import sObjectFactoryTemplate from "../../resources/templates/apex/test/SObjectFactory.cls.handlebars";
import deployApexCodeTemplate from "../../resources/templates/soap/apex/DeployApexCode.xml.handlebars";
import deleteApexCodeTemplate from "../../resources/templates/soap/apex/DeleteApexCode.xml.handlebars";

export const getWebhookCallout = (secretToken) => {
  const webhookCalloutName = getRandomName("Callout");
  let body = webhookCalloutTemplate({
    webhookCalloutName,
    secretToken,
  });
  // Normalize line breaks if needed for consistent formatting in XML
  if (body.includes('\n')) {
    body = body.replace(/\n/g, ' ').replace(/\s+/g, ' ').trim();
  }
  return {
    body,
    name: webhookCalloutName,
  };
};

export const getWebhookCalloutMock = () => {
  const webhookCalloutMockName = getRandomName("CalloutMock");
  let body = httpCalloutMockTemplate({
    webhookCalloutMockName,
  });
  // Normalize line breaks in the template output to prevent "Illegal string literal" errors
  body = body.replace(/\n/g, ' ').replace(/\s+/g, ' ').trim();
  return {
    body,
    name: webhookCalloutMockName,
  };
};

export const getSObjectFactory = () => {
  const name = getRandomName("SObjectFactory");
  let body = sObjectFactoryTemplate({
    name,
  });
  // Keep original formatting for this large template as it doesn't cause XML issues
  return {
    body,
    name,
  };
};

export const getWebhookTrigger = (
  template,
  webhookCallout,
  templateVars = {},
) => {
  const { name: webhookCalloutName } = webhookCallout;
  const triggerName = getRandomName("Trigger");
  let body = template({
    ...templateVars,
    triggerName,
    webhookCalloutName,
  });
  // Normalize line breaks if needed for consistent formatting in XML
  if (body.includes('\n')) {
    body = body.replace(/\n/g, ' ').replace(/\s+/g, ' ').trim();
  }
  return {
    body,
    name: triggerName,
  };
};

export const getWebhookTriggerTest = (
  template,
  webhookCalloutMock,
  sObjectFactory,
  templateVars = {},
) => {
  const { name: sObjectFactoryName } = sObjectFactory;
  const { name: webhookCalloutMockName } = webhookCalloutMock;
  const testClassName = getRandomName("Test");
  let body = template({
    ...templateVars,
    testClassName,
    sObjectFactoryName,
    webhookCalloutMockName,
  });
  // Test classes generally don't need normalization as they don't create illegal string literals
  return {
    body,
    name: testClassName,
  };
};

export const getDeployApexCodeBody = (authToken, classes, triggers) => {
  const classBodies = classes.map((c) => escapeXml(c.body));
  const triggerBodies = triggers.map((t) => escapeXml(t.body));
  const body = deployApexCodeTemplate({
    authToken,
    classBodies,
    triggerBodies,
  });
  return {
    body,
  };
};

export const getDeleteApexCodeBody = (authToken, classNames, triggerNames) => {
  const escapedClassNames = classNames.map(name => escapeXml(name));
  const escapedTriggerNames = triggerNames.map(name => escapeXml(name));
  const body = deleteApexCodeTemplate({
    authToken,
    classNames: escapedClassNames,
    triggerNames: escapedTriggerNames,
  });
  return {
    body,
  };
};
