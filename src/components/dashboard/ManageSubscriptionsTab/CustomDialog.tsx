import React, { useState } from 'react';
import { Modal, Form, Input, Upload, Button, Image } from 'antd';
import { UploadOutlined, DeleteOutlined } from '@ant-design/icons';

interface CustomDialogProps {
  isOpen: boolean;
  data: any;
  onClose: () => void;
  onSubmit: (formData: any) => void;
  editMode: boolean;
}

const CustomDialog: React.FC<CustomDialogProps> = ({ isOpen, data, onClose, onSubmit, editMode }) => {
  const [form] = Form.useForm();
  const imageBaseURL = `${process.env.REACT_APP_BACKEND_URL || ""}storage/`;
  const [showUpload, setShowUpload] = useState(!editMode || !data?.image_name); // Show upload if no image exists

  // On form submit
  const handleFormSubmit = () => {
    form.validateFields()
      .then(values => {
        onSubmit(values); // Call the parent submit function with form data
        form.resetFields();
      })
      .catch(info => {
        console.log('Validation Failed:', info);
      });
  };

  // Handle picture deletion
  const handleDeletePicture = () => {
    setShowUpload(true); // Show upload section after deletion
    form.setFieldsValue({ profilePic: null }); // Clear the current profilePic value
  };

  return (
    <Modal
      title={editMode ? "Edit User" : "Add User"}
      open={isOpen}
      onCancel={() => {
        form.resetFields();
        onClose();
      }}
      onOk={handleFormSubmit}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={data}
      >
        <Form.Item name="id" noStyle>
          <Input type="hidden" value="id" />
        </Form.Item>

        {/* Display current profile picture if in edit mode and profile picture exists */}
        {editMode && data?.image_name && !showUpload && (
          <Form.Item label="Current Profile Picture">
            <Image
              src={imageBaseURL + data.image_name}
              alt="Current Profile Picture"
              width={100}
              height={100}
              style={{ marginBottom: '10px', objectFit: 'cover' }}
            />
            <Button icon={<DeleteOutlined />} onClick={handleDeletePicture} type="link">
              Delete Picture
            </Button>
          </Form.Item>
        )}

        {/* Conditionally display the upload field */}
        {showUpload && (
          <Form.Item
            name="profilePic"
            label="Profile Picture"
            valuePropName="file"
            rules={[{ required: true, message: 'Please upload a profile picture' }]}
          >
            <Upload listType="picture" maxCount={1} beforeUpload={() => false}>
              <Button icon={<UploadOutlined />}>Upload Profile Picture</Button>
            </Upload>
          </Form.Item>
        )}

        <Form.Item
          name="full_name"
          label="Full Name"
          rules={[{ required: true, message: 'Please enter your name' }]}
        >
          <Input placeholder="Enter full name" />
        </Form.Item>

        <Form.Item
          name="email"
          label="Email"
          rules={[{ required: true, type: 'email', message: 'Please enter a valid email' }]}
        >
          <Input placeholder="Enter email" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CustomDialog;

