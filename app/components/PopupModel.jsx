import { Form } from "@remix-run/react";
import { Button, Frame, Modal, TextContainer } from "@shopify/polaris";

export default function PopupModel({ active, handleChange, data }) {
  return (
    <div style={{ height: "500px" }}>
      <Frame>
        <Modal
          open={active}
          onClose={handleChange}
          title="Reach more shoppers with Instagram product tags"
          primaryAction={{
            content: "Add Instagram",
            onAction: handleChange,
          }}
          secondaryActions={[
            {
              content: "Learn more",
              onAction: handleChange,
            },
          ]}
        >
          <Modal.Section>
            <TextContainer>
              <Form method="PATCH">
                <input type="text" name="id" defaultValue={data.id} hidden />
                <input type="text" name="title" defaultValue={data.title} />
                <input
                  type="text"
                  name="description"
                  defaultValue={data.description}
                />
                <button type="submit">Submit</button>
              </Form>
            </TextContainer>
          </Modal.Section>
        </Modal>
      </Frame>
    </div>
  );
}
