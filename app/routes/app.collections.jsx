import { Card, Layout, Page, Button } from "@shopify/polaris";
import { authenticate } from "../shopify.server";

import { Form, Link, useLoaderData, useSubmit } from "@remix-run/react";
import PopupModel from "../components/PopupModel";
import { useState } from "react";

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
  let response;
  const { admin } = await authenticate.admin(request);
  const formData = await request.formData();
  const values = Object.fromEntries(formData);

  if (request.method === "POST") {
    response = await admin.graphql(
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
  }

  if (request.method === "DELETE") {
    response = await admin.graphql(
      `#graphql
      mutation collectionDelete($input: CollectionDeleteInput!) {
        collectionDelete(input: $input) {
          deletedCollectionId
          shop {
            id
            name
          }
          userErrors {
            field
            message
          }
        }
      }`,
      {
        variables: {
          input: {
            id: values.collectionId,
          },
        },
      }
    );
  }

  if (request.method === "PATCH") {
    response = await admin.graphql(
      `#graphql
      mutation collectionUpdate {
        collectionUpdate(input: {id: "${values.id}", title: "${values.title}", descriptionHtml: "${values.description}"}) {
        
          collection {
            id
          }          
        }
      }`
    );
  }

  const data = await response.json();
  return data;
}

export default function Collections() {
  const { data } = useLoaderData();
  const submit = useSubmit();

  /* model */

  const [active, setActive] = useState(false);

  const handleChange = () => {
    if (active) {
      setActive(false);
    } else {
      setActive(true);
    }
  };

  const activator = <Button onClick={handleChange}>Edit</Button>;

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
                  <th>Edit</th>
                  <th>Delete</th>
                  <th>View Products</th>
                </tr>
                {data.collections.edges.map((cl) => (
                  <tr key={cl.node.id}>
                    <td>{cl.node.title}</td>
                    <td>{cl.node.description}</td>
                    <td>
                      {activator}
                      {active && (
                        <PopupModel
                          active={active}
                          handleChange={handleChange}
                          data={{
                            id: cl.node.id,
                            title: cl.node.title,
                            description: cl.node.description,
                          }}
                        />
                      )}
                    </td>
                    <td>
                      <Button
                        variant="primary"
                        onClick={() => {
                          const formData = new FormData();
                          formData.set("collectionId", cl.node.id);
                          submit(formData, {
                            method: "delete",
                            encType: "application/x-www-form-urlencoded",
                            preventScrollReset: false,
                            replace: false,
                            relative: "route",
                          });
                        }}
                      >
                        Delete
                      </Button>
                    </td>
                    <td>
                      <Button variant="tertiary">
                        <Link to={`/app/products?collectionId=${cl.node.id}`}>
                          View Products
                        </Link>
                      </Button>
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
