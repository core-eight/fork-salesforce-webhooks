import { getRandomName, escapeXml } from "./common.js";
import webhookCalloutTemplate from "../../resources/templates/apex/src/WebhookCallout.cls.handlebars";
import httpCalloutMockTemplate from "../../resources/templates/apex/test/HttpCalloutMock.cls.handlebars";
import sObjectFactoryTemplate from "../../resources/templates/apex/test/SObjectFactory.cls.handlebars";
import deployApexCodeTemplate from "../../resources/templates/soap/apex/DeployApexCode.xml.handlebars";
import deleteApexCodeTemplate from "../../resources/templates/soap/apex/DeleteApexCode.xml.handlebars";

export const getWebhookCallout = (secretToken) => {
  const webhookCalloutName = getRandomName("Callout");
  const body = webhookCalloutTemplate({
    webhookCalloutName,
    secretToken,
  });
  return {
    body,
    name: webhookCalloutName,
  };
};

export const getWebhookCalloutMock = () => {
  const webhookCalloutMockName = getRandomName("CalloutMock");
  const body = httpCalloutMockTemplate({
    webhookCalloutMockName,
  });
  return {
    body,
    name: webhookCalloutMockName,
  };
};

export const getSObjectFactory = () => {
  const name = getRandomName("SObjectFactory");
  const body = sObjectFactoryTemplate({
    name,
  });
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
  const body = template({
    ...templateVars,
    triggerName,
    webhookCalloutName,
  });
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
  const body = template({
    ...templateVars,
    testClassName,
    sObjectFactoryName,
    webhookCalloutMockName,
  });
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
