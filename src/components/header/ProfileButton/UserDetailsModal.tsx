import React, { useState, useEffect } from 'react';
import { Modal, Tabs, Descriptions, Button, Table, Divider, Upload, Image, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

import axios from 'axios';
interface UserDetailsModalProps {
  visible: boolean;
  onClose: () => void;
}
interface UserData {
  name: string;
  email: string;
  image: string;
  role: string;
  user_plan: string;
  status: string;
  creation_date: string;
}
interface CompanyData {
  company_name: string;
  company_logo: string;
  company_address: string;
  account_status: string;
  is_close_request: string;
}

const UserDetailsModal: React.FC<UserDetailsModalProps> = ({ visible, onClose }) => {
  const [loading, setLoading] = useState(true);
  const [closeReq, setCloseReq] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [companyData, setCompanyData] = useState<CompanyData | null>(null);
  const [subscriptionData, setSubscriptionData] = useState<any>(null);
  const [logo, setLogo] = useState(null);
  const [fileList, setFileList] = useState([]);
  const [previewImage, setPreviewImage] = useState(null);
  const token = localStorage.getItem('bearerToken') || '';
  const baseURL = `${process.env.REACT_APP_BACKEND_URL || ""}api/`;
  const imageBasePath  =`${process.env.REACT_APP_BACKEND_URL || ""}storage/`;


  useEffect(() => {
    if (visible) {
      // Fetch user details and subscription details
      const fetchData = async () => {
        setLoading(true);
        try {
          const userResponse = await axios.get(baseURL + `user/details`, {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
          });
          setUserData(userResponse.data.personal_info);
          setCompanyData(userResponse.data.company_info);
          setSubscriptionData(userResponse.data.subscription_info);
          if(userResponse.data.company_info.is_close_request == 'Y'){
            setCloseReq(true)
          }else {
            setCloseReq(false)
          }
        } catch (error) {
          console.error('Error fetching data:', error);
        }
        setLoading(false);
      };

      fetchData();
    }
  }, [visible]);
    // Handle file upload manually to send to backend
    const handleUpload = async (options:any) => {
      const { file, onSuccess, onError } = options;
      const formData = new FormData();
      formData.append('file', file);
        try {
        const response = await axios.post(baseURL + 'company_logo_upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`,
          },
        });  
        onSuccess(response.data);
        localStorage.setItem('company_logo', response.data.path);
        message.success('File uploaded successfully!');
        setPreviewImage(URL.createObjectURL(file));
      } catch (error) {
        onError(error);
        message.error('File upload failed.');
      }
    };
    const beforeUpload = (file:any) => {
      const isImage = file.type === 'image/jpeg' || file.type === 'image/png';
      const isLt2M = file.size / 1024 / 1024 < 2;
  
      if (!isImage) {
        message.error('You can only upload JPG/PNG file!');
      }
      if (!isLt2M) {
        message.error('Image must be smaller than 2MB!');
      }
  
      return isImage && isLt2M; // Return true if valid, false to reject
    };
  
    const uploadProps = {
      customRequest: handleUpload,
      fileList,
      beforeUpload, // Validate file type and size before upload
      onChange(info:any) {
        setFileList(info.fileList.slice(-1));
      },
      onRemove() {
        setPreviewImage(null);
      },
      maxCount: 1,
    };
  

  const subscriptionColumns = [
    {
      title: 'Plan Name',
      dataIndex: 'plan_name',
      key: 'plan_name',
    },
    {
      title: 'Plan Type',
      dataIndex: 'plan_type',
      key: 'plan_type',
    },
    {
      title: 'Next Billing Date',
      dataIndex: 'next_billing_at',
      key: 'next_billing_at',
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
    },
  ];


  return (
    <Modal
      title="User Details"
      open={visible}
      onCancel={onClose}
      footer={[
        <Button key="close" onClick={onClose}>
          Close
        </Button>,
      ]}
      width={600}
      centered
      destroyOnClose
    >
      <Tabs defaultActiveKey="1">
        <Tabs.TabPane tab="Details" key="1">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <>
              <Divider orientation="left">User Information</Divider>
              <Descriptions bordered column={1} size="small">
                <Descriptions.Item label="Name">{userData.name}</Descriptions.Item>
                <Descriptions.Item label="Email">{userData.email}</Descriptions.Item>
                <Descriptions.Item label="Profile Pic">{userData.image}</Descriptions.Item>
                <Descriptions.Item label="Role">{userData.role}</Descriptions.Item>
                <Descriptions.Item label="Plan">{userData.user_plan}</Descriptions.Item>
                <Descriptions.Item label="Creation Date">{userData.creation_date}</Descriptions.Item>
              </Descriptions>

              <Divider orientation="left">Company Details</Divider>
              <Descriptions bordered column={1} size="small">
                <Descriptions.Item label="Name">{companyData.company_name}</Descriptions.Item>
                <Descriptions.Item label="Logo">
                  <img 
                  src={imageBasePath +companyData.company_logo} 
                  alt="Description of image" 
                  style={{ width: '25%', height: '25%', borderRadius: '8px' }} // Optional styling
                  />
                </Descriptions.Item>
                <Descriptions.Item label="Address">{companyData.company_address}</Descriptions.Item>
                <Descriptions.Item label="Status">{companyData.account_status}</Descriptions.Item>
              </Descriptions>
            </>
          )}
        </Tabs.TabPane>
        <Tabs.TabPane tab="Subscription Details" key="2">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <Table
              dataSource={subscriptionData || []}
              columns={subscriptionColumns}
              rowKey="id"
              pagination={false}
            />
          )}
        </Tabs.TabPane>
        <Tabs.TabPane tab="Company Logo" key="3">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <div>
            <Upload {...uploadProps}>
              <Button icon={<UploadOutlined />}>Upload Image</Button>
            </Upload>
      
            {previewImage && (
              <div style={{ marginTop: 16 }}>
                <h3>Uploaded Image Preview:</h3>
                <Image
                  width={200}
                  src={previewImage}
                  alt="Uploaded Thumbnail"
                  style={{ border: '1px solid #e8e8e8', padding: 4 }}
                />
              </div>
            )}
          </div>
          )}
        </Tabs.TabPane>
        <Tabs.TabPane tab="Close Company Account" key="4">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <div>
            {/* Conditional rendering of buttons based on the value */}
            {closeReq ? (
              <Button type="default" disabled>
              Request Sent
              </Button>
            ) : (
              <Button type="primary" onClick={() => setCloseReq(true)}>
               Close Company Account
              </Button>
            )}
          </div>
      
          )}
        </Tabs.TabPane>
      </Tabs>
    </Modal>
  );
};

export default UserDetailsModal;
