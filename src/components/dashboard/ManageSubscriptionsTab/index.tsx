import { Flex, Space, Button, Tooltip, Spin, Dropdown } from "antd";

import { Row, Col, Typography } from 'antd';
const { Title } = Typography;
import React, { useState, useEffect, useRef } from 'react';
import {
  GridComponent,
  ColumnsDirective,
  ColumnDirective,
  Edit,
  Inject,
  Toolbar,
  CommandColumn,
  Page,
  ExcelExport,
  PdfExport,
  Search,
  EditSettingsModel
} from '@syncfusion/ej2-react-grids';
import CustomDialog from "./CustomDialog"; // Import the custom dialog component
import { Grid } from '@syncfusion/ej2-grids';
import { UploaderComponent } from '@syncfusion/ej2-react-inputs';
import { TooltipComponent } from '@syncfusion/ej2-react-popups';
import { ClickEventArgs } from '@syncfusion/ej2-navigations';
import { registerLicense } from '@syncfusion/ej2-base';
import UserSubscriptionDetails from './UserSubscriptionDetails';
import { SolutionOutlined } from '@ant-design/icons';
// TypeScript type for user data
interface UserData {
  id?: number;
  image_name?: string;
  email?: string;
  LicenseAssigned?: boolean;
  full_name?: string;
  creation_date?: Date;
  user_type?: string;
  last_update_date?: Date;
  PasswordReset?: boolean;
  user_role?: string;
}

import styles from "./styles.module.css";
const token = localStorage.getItem('bearerToken') || '';

const ManageSubscriptionsTab = () => {
  registerLicense('Ngo9BigBOggjHTQxAR8/V1NCaF1cVGhIfEx1RHxQdld5ZFRHallYTnNWUj0eQnxTdEFjUX5XcHVVQ2NfUUR2Vg==');
  const baseURL = `${process.env.REACT_APP_BACKEND_URL || ""}api/`;
  const imageBaseURL = `${process.env.REACT_APP_BACKEND_URL || ""}storage/`;


  const [data, setData] = useState([]);
  const hasFetchedData = useRef(false); // useRef persists across re-renders
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showDialog, setShowDialog] = useState(false);
  const [dialogData, setDialogData] = useState<UserData | null>(null);
  const [editMode, setEditMode] = useState(false);
  const gridRef = useRef<GridComponent | null>(null);
  const toolbarOptions = ['Add', 'Edit', 'ExcelExport', 'PdfExport', 'Search'];

  let grid: GridComponent | null;
  const editOptions: EditSettingsModel = { allowEditing: true, allowAdding: true, mode: 'Dialog' };

  const toolbarClick = (args: ClickEventArgs) => {
    if (args.item.id === 'Grid_add') {
      setEditMode(false);
      setDialogData(null);
      setShowDialog(true);
    }
    if (gridRef && args.item.id?.includes('pdfexport')) {
      gridRef.current?.pdfExport({
        fileName: 'subscribed-users.pdf',
        theme: {
          header: { bold: true, fontColor: '#454545', fontName: 'Calibri', fontSize: 10 },
          record: { fontColor: '#1D1D1D', fontName: 'Calibri', fontSize: 8 }
        }
      });
    } else if (gridRef && args.item.id?.includes('excelexport')) {
      gridRef.current?.excelExport({
        fileName: 'subscribed-users.xlsx',
        theme: {
          header: { bold: true, fontColor: '#454545', fontName: 'Calibri', fontSize: 10 },
          record: { fontColor: '#1D1D1D', fontName: 'Calibri', fontSize: 8 }
        }
      });

    }
  }
  const actionBegin = (args: any) => {
    if (args.requestType === 'beginEdit') {
      setEditMode(true);
      setDialogData(args.rowData);
      setShowDialog(true);
      args.cancel = true;
    }
    if (args.requestType === 'add') {
      setEditMode(false);
      setDialogData(null);
      setShowDialog(true);
      args.cancel = true;
    }
  };
  const handleDialogClose = () => setShowDialog(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await fetch(baseURL + 'manage_users', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      const result = await response.json(); // Assuming the API returns JSON data
      setData(result); // Update state with the fetched data
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setTimeout(() => {
        // Simulating response from backend
        setLoading(false);
      }, 3000); // Simulate 3 seconds delay
    }
  };

  useEffect(() => {
    if (!hasFetchedData.current) {
      fetchData();
    }
    hasFetchedData.current = true;

  }, []);

  function pictureTemplate(props: any): any {
    // Prepend "localhost" to the image path
    const fullImagePath = imageBaseURL + props.image_name;

    return <img src={(props.image_name != "") ? fullImagePath : '../../../../../images/default_face.png'} alt="User Thumbnail" style={{ height: '50px', width: '50px' }} />;
  };
  const handleViewDetails = (userId: number) => {
    setSelectedUserId(userId);
    setModalVisible(true);
  };
  function toggleTemplate(props: any): any {
    return <div style={{ display: 'content' }} ><Button onClick={() => handleViewDetails(props.id)}><SolutionOutlined style={{ fontSize: '20px', marginLeft: '10px', color: '#1677ff' }} /></Button></div>;
  };

  function commandTemplate(props: any): any {
    const tooltipContent = `<span id='tooltipContent'><strong>Created By:</strong> ${props.created_by}<br><strong>Updated By:</strong> ${props.last_updated_by}<br><strong>Creation Date:</strong> ${props.created_with_timezone}<br><strong>Update Date:</strong> ${props.last_update_with_timezone}</span>`;
    return (
      <div style={{ display: 'flex', gap: '10px' }}>
        <TooltipComponent className="tooltip-box" content={tooltipContent} position="TopCenter" openDelay={100} closeDelay={10} cssClass='customtip'>
          <div className="e-flat e-eye e-icons e-medium"></div>
        </TooltipComponent>
      </div>
    );
  };
  const actionComplete = async (args: any) => {
    if (args.requestType === 'save' && args.action === 'add') {
      // args.data = {
      //   ...args.data,
      //   profilePic: uploadedFile // Adding the file content as a new key-value pair
      // };
      // Get user's timezone
      console.log(args.data);
      const formDataToSend = new FormData();
      formDataToSend.append('image_name', args.data.profilePic.fileList[0].originFileObj);
      formDataToSend.append('email', args.data.email);
      formDataToSend.append('full_name', args.data.full_name);
      formDataToSend.append('user_type', "Buy");
      setLoading(true)
      try {
        const response = await fetch(baseURL + 'manage_users', {
          method: 'POST',
          headers: {
            // 'Content-Type':'multipart/form-data',
            'Authorization': `Bearer ${token}`,
          }, body: formDataToSend,
        });

        if (response.ok) {
          const newData = await fetchData();  // Re-fetch all data after update
        } else {
          console.error('Failed to save the data.');
        }
      } catch (error) {
        console.error('Error while saving the data:', error);
      } finally {
        setTimeout(() => {
          // Simulating response from backend
          setLoading(false);
        }, 3000); // Simulate 3 seconds delay
      }
    } else if (args.requestType === 'save' && args.action === 'edit') {
      // args.data = {
      //   ...args.data,
      //   profilePic: uploadedFile // Adding the file content as a new key-value pair
      // };
      console.log(args.data);
      const formDataToSend = new FormData();
      // Append only if `profilePic` data exists in `args.data`
      if (args.data.profilePic?.fileList?.[0]?.originFileObj) {
        formDataToSend.append('image_name', args.data.profilePic.fileList[0].originFileObj);
      }
      formDataToSend.append('email', args.data.email);
      formDataToSend.append('full_name', args.data.full_name);
      formDataToSend.append('id', args.data.id);
      setLoading(true)

      try {
        const updateUser = args.data.id;

        const response = await fetch(baseURL + `manage_users/edit`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,

          },
          body: formDataToSend,
        });

        if (response.ok) {
          const newData = await fetchData();  // Re-fetch all data after update
          // setData(newData);  // Update the grid with the latest data
          // const savedData = await response.json();

          // Use a timeout to avoid clashes with the dialog closing
          // setTimeout(() => {
          //   setData(savedData);
          //   // setData((prevData) => [...prevData, savedData]);
          // }, 100);
        } else {
          console.error('Failed to save the data.');
        }
      } catch (error) {
        console.error('Error while saving the data:', error);
      } finally {
        setTimeout(() => {
          // Simulating response from backend
          setLoading(false);
        }, 3000); // Simulate 3 seconds delay
      }
    }
  };
  const handleDialogSubmit = (formData: UserData) => {
    actionComplete({ requestType: 'save', action: editMode ? 'edit' : 'add', data: formData });
    setShowDialog(false); // Close the dialog after submission    
  };

  const handleButtonClick = async (email: any) => {
    const formDataToSend = new FormData();
    formDataToSend.append('email', email);
    setLoading(true)
    try {
      const response = await fetch(baseURL + `manage_users/send-otp`, {
        method: 'POST', // or 'POST', 'PUT', etc.
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,

        },
        body: formDataToSend,
      });

      if (response.ok) {
        const result = await response.json();
        console.log('API Response:', result);
        // Optionally, update the grid data or UI based on the response
      } else {
        console.error('API request failed with status:', response.status);
      }
    } catch (error) {
      console.error('Error calling API:', error);
    } finally {
      setTimeout(() => {
        // Simulating response from backend
        setLoading(false);
      }, 3000); // Simulate 3 seconds delay
    }
  };

  const ResetTemplate = (props: any) => {
    return (
      <button
        className="e-flat e-primary"
        onClick={() => handleButtonClick(props.email)}
        style={{ backgroundColor: '#1677ff', color: 'white', padding: '5px 10px', border: 'none', borderRadius: '10px' }}>
        RESET
      </button>
    );
  };


  return (
    <div className={styles.container}>
      <Spin spinning={loading} tip="Loading...">
        <Space direction="vertical" size="large" className={styles.main}>
          <Space direction="vertical" size="small" className={styles.main + ' ' + styles.spaceItem}>
            <Title level={4}>Manage Users </Title>
            <GridComponent
              dataSource={data}
              toolbar={toolbarOptions}
              allowPaging={true}
              pageSettings={{ pageSize: 10 }}
              allowExcelExport={true}
              allowPdfExport={true}
              toolbarClick={toolbarClick}
              editSettings={editOptions}
              actionBegin={actionBegin}
              ref={gridRef}
              actionComplete={actionComplete}
            >
              <ColumnsDirective>
                <ColumnDirective field="image_name" headerText='Picture' width='50' template={pictureTemplate} textAlign='Center' />
                <ColumnDirective field='id' headerText='Order ID' width='50' type="number" textAlign="Right" isPrimaryKey={true} visible={false} />
                <ColumnDirective field='email' headerText='User Name' width='150' type="string" validationRules={{ required: true, email: true }} />
                <ColumnDirective field='License Assigned' headerText='License Assigned' width='100' type="boolean" template={toggleTemplate} />
                <ColumnDirective field='full_name' headerText='Full Name' width='100' type="string" editType="stringedit" validationRules={{ required: true }} />
                <ColumnDirective field='creation_date' headerText='Date Signed up' type='date' editType="datepickeredit" format='yMd' width='100' validationRules={{ required: true }} />
                <ColumnDirective field="user_type" headerText="User Type" width='100' editType="dropdownedit" validationRules={{ required: true }} />
                <ColumnDirective field="last_update_date" headerText="Last Login Date" type='date' editType="datepickeredit" format='yMd' width='100' validationRules={{ required: true }} />
                <ColumnDirective field="PasswordReset" headerText="Password Reset" width='100' template={ResetTemplate} allowEditing={false} />
                <ColumnDirective field="user_role" headerText="Admin Role" width='100' allowEditing={false} />
                <ColumnDirective headerText='Who' width='100' allowEditing={false} template={commandTemplate} />
              </ColumnsDirective>
              <Inject services={[Edit, Page, Toolbar, CommandColumn, ExcelExport, PdfExport, Search]} />
            </GridComponent>
            {showDialog && (
              <CustomDialog
                isOpen={showDialog}
                data={dialogData}
                onClose={handleDialogClose}
                onSubmit={handleDialogSubmit}
                editMode={editMode}
              />
            )}

            <UserSubscriptionDetails
              visible={modalVisible}
              userId={selectedUserId}
              onClose={() => {
                setModalVisible(false);
                setSelectedUserId(null); // Clear the selected user ID when closing
              }}
            />
          </Space>
        </Space>
      </Spin>
    </div>
  );
};

export { ManageSubscriptionsTab };
