import {
  Box,
  Card,
  Layout,
  Link,
  List,
  Page,
  Text,
  BlockStack,
  LegacyCard,
  DataTable,
  Button,
  Modal,
  FormLayout,
  TextField,
} from "@shopify/polaris";
import { authenticate } from "../shopify.server";

import { Form, useLoaderData, useLocation } from "@remix-run/react";

export const loader = async ({ request }) => {
  const { admin } = await authenticate.admin(request);

  const url = new URL(request.url);
  const collectionId = url.searchParams.get("collectionId");

  const response = await admin.graphql(`
    query {
      collection(id: "${collectionId}") {
        handle
    products(first: 50) {
      nodes {
        title,
        id,
        status
      }
    }
      }
    }
  `);

  const data = await response.json();

  return data;
};

export default function Products() {
  const { data } = useLoaderData();
  console.log(data);
  return (
    <Page>
      <ui-title-bar title="All Collections">
        <button variant="primary">Add New Collection</button>
      </ui-title-bar>
      <Layout>
        <Layout.Section>
          <Card>
            <table>
              <tbody>
                <tr>
                  <th>Name</th>
                  <th>Description</th>
                </tr>
              </tbody>
            </table>
          </Card>
        </Layout.Section>

        <Layout.Section>
          <Card>
            <Form method="post">
              <input type="text" name="title" />
              <input type="text" name="description" />
              <button type="submit">Submit</button>
            </Form>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
