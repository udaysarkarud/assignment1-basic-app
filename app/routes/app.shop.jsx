import {
  Box,
  Card,
  Layout,
  Link,
  List,
  Page,
  Text,
  BlockStack,
  Button,
  Frame,
  Modal,
  TextContainer,
} from "@shopify/polaris";
import { authenticate } from "../shopify.server";
import { useLoaderData } from "@remix-run/react";

export const loader = async ({ request }) => {
  const { admin } = await authenticate.admin(request);

  const response = await admin.graphql(
    `#graphql
    query {
      shop {
        name
        id      
      }
    }`
  );

  const data = await response.json();

  return data;
};

export default function Shop() {
  const { data } = useLoaderData();
  return (
    <Page>
      <ui-title-bar title="Shop Details" />
      <Layout>
        <Layout.Section>
          <Card>
            <BlockStack gap="200">
              <Text as="h2" variant="headingMd">
                Your Shop Details
              </Text>
              <List>
                <List.Item>Shope Name: {data.shop.name}</List.Item>
                <List.Item>Shop Id: {data.shop.id}</List.Item>
              </List>
            </BlockStack>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
