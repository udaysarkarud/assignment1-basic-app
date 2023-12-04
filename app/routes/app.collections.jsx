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

import { Form, useLoaderData } from "@remix-run/react";

export const loader = async ({ request }) => {
  const { admin } = await authenticate.admin(request);

  const response = await admin.graphql(
    `#graphql
    query {
      collections(first: 20) {
        edges {
          node {
            id
            title
            description
           
          }
        }
      }
    }`
  );

  const data = await response.json();

  return data;
};

export async function action({ request }) {
  const { admin } = await authenticate.admin(request);
  const formData = await request.formData();
  const values = Object.fromEntries(formData);

  const response = await admin.graphql(
    `#graphql
    mutation CollectionCreate($input: CollectionInput!) {
      collectionCreate(input: $input) {

        collection {
          id
          title
          descriptionHtml

         
        }
      }
    }`,
    {
      variables: {
        input: {
          title: values.title,
          descriptionHtml: values.description,
        },
      },
    }
  );

  const data = await response.json();
  return data;
}

export default function Collections() {
  const { data } = useLoaderData();

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
                  <th>Title</th>
                  <th>Description</th>
                  <th>Action</th>
                </tr>
                {data.collections.edges.map((cl) => (
                  <tr key={cl.node.id}>
                    <td>{cl.node.title}</td>
                    <td>{cl.node.description}</td>
                    <td>
                      <Button>Edit</Button>
                    </td>
                  </tr>
                ))}
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
