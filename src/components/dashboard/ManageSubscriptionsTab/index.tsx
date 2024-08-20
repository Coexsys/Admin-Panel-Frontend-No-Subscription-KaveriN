import { Flex, Space, Row, Col, Table, Tag, Card } from "antd";
import type { TableProps } from "antd";
import {
  IconExternalLink,
  IconFileExcel,
  IconRefresh,
  IconHelp,
} from "@tabler/icons-react";
import React, { useState, useEffect } from 'react';
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
import { UploaderComponent } from '@syncfusion/ej2-react-inputs';
import { CheckBoxComponent } from '@syncfusion/ej2-react-buttons';
import { TooltipComponent } from '@syncfusion/ej2-react-popups';
import { ClickEventArgs } from '@syncfusion/ej2-navigations';
import { registerLicense } from '@syncfusion/ej2-base';
import { ButtonComponent } from '@syncfusion/ej2-react-buttons';


import axios from 'axios';
import styles from "./styles.module.css";



const ManageSubscriptionsTab = () => {
  interface DataType {
    key: string;
    name: string;
    age: number;
    address: string;
    tags: string[];
  }
  registerLicense('Ngo9BigBOggjHTQxAR8/V1NCaF1cVGhIfEx1RHxQdld5ZFRHallYTnNWUj0eQnxTdEFjUX5XcHVVQ2NfUUR2Vg==');

  const [data, setData] = useState([]);
  let grid: GridComponent | null;
  const editOptions: EditSettingsModel = { allowEditing: true, allowAdding: true, mode: 'Dialog' };

  const toolbarClick = (args: ClickEventArgs) => {
    if (grid && args.item.id?.includes('pdfexport')) {
      grid.pdfExport({
        fileName:'subscribed-users.pdf',
        theme:{
          header:{
            bold:true,
            fontColor:'#454545',
            fontName:'Calibri',
            fontSize:10
          },
          record:{
            fontColor:'#1D1D1D',
            fontName:'Calibri',
            fontSize:8
          }
        }
      });
    } else if(grid && args.item.id?.includes('excelexport')){
      grid.excelExport({
        fileName:'subscribed-users.xlsx',
        theme:{
          header:{
            bold:true,
            fontColor:'#454545',
            fontName:'Calibri',
            fontSize:10
          },
          record:{
            fontColor:'#1D1D1D',
            fontName:'Calibri',
            fontSize:8
          }
        }
      });

    }
  }


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/manage_users');
        const result = await response.json(); // Assuming the API returns JSON data
        setData(result); // Update state with the fetched data
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData(); 
    }, []);

    function pictureTemplate (props: any): any {
      return <img src= 'https://img.icons8.com/?size=50&id=x2tr2g6eXjMc&format=png&color=000000' alt="User Thumbnail" style={{ height: '50px', width: '50px' }} />;
    };
  
    function pictureEditTemplate (arg: any): any {
      return (
        <UploaderComponent
          asyncSettings={{ saveUrl: 'https://your-save-url', removeUrl: 'https://your-remove-url' }}
          success={(e) => {
            arg.rowData.Picture = e.file.name; // Assuming the backend returns the file name
          }}
        />
      );
    };
  
    function fullNameValidator  (arg: any): any  {
      return arg.value ? '' : 'Full Name is required';
    };
  
    function toggleTemplate  (props: any): any  {
      return <CheckBoxComponent checked={props.IsActive} />;
    };

    function commandTemplate(props: any): any  {
      const tooltipContent = `<span id='tooltipContent'><p><strong>Created By:</strong> ${props.created_by}</p><p><strong>Updated By:</strong> ${props.last_updated_by}</p><p><strong>Creation Date:</strong> ${props.creation_date}</p><p><strong>Update Date:</strong> ${props.last_update_date}</p></span>`;
      return (
        <div style={{ display: 'flex', gap: '10px' }}>
          <TooltipComponent content="Edit Record" position="TopCenter">
            <button className="e-flat e-edit e-icons"></button>
          </TooltipComponent>
          <TooltipComponent  content={tooltipContent} position="TopCenter">
            <button className="e-flat e-eye e-icons"></button>
          </TooltipComponent>
        </div>
      );
    };
const actionComplete = async (args:any) => {
  if (args.requestType === 'save' && args.action === 'add') {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/manage_users/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(args.data),
      });

      if (response.ok) {
        const savedData = await response.json();

        // Use a timeout to avoid clashes with the dialog closing
        setTimeout(() => {
          setData(savedData);
          // setData((prevData) => [...prevData, savedData]);
        }, 100);
      } else {
        console.error('Failed to save the data.');
      }
    } catch (error) {
      console.error('Error while saving the data:', error);
    }
  }
};

const handleButtonClick = async  (user_email:any) => {
  const formDataToSend = new FormData();
  formDataToSend.append('email', user_email);
  try {
    const response = await fetch(`http://127.0.0.1:8000/api/manage_users/send-otp`, {
      method: 'POST', // or 'POST', 'PUT', etc.
      // headers: {
      //   'Content-Type': 'application/json',
      // },
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
  }
};

const ResetTemplate = (props:any) => {
  return (
    <button
      className="e-flat e-primary"
      onClick={() => handleButtonClick(props.user_email)}
      style={{ backgroundColor: '#454545', color: 'white', padding: '5px 10px', border: 'none', borderRadius: '10px' }}

    >
      RESET
    </button>
  );
};




  const toolbarOptions = ['Add','Edit', 'ExcelExport', 'PdfExport', 'Search'];
  const [pageSettings, setPageSettings] = useState();

  return (
    <Space direction="vertical" size="large" className={styles.main}>
      <div>
        <Flex gap={4} align="center">
          <p className={styles.heading}>License Usage</p>
          <IconExternalLink size={18} />
        </Flex>
        <Row gutter={16}>
          <Col xs={24} md={12} lg={6} className={styles["row-gap"]}>
            <Card>
              <p className={styles["card-title"]}>248</p>
              <p className={styles["card-description"]}>
                Total License Inventory
              </p>
            </Card>
          </Col>
          <Col xs={24} md={12} lg={6} className={styles["row-gap"]}>
            <Card>
              <p className={styles["card-title"]}>200</p>
              <p className={styles["card-description"]}>
                Licenses currently assigned
              </p>
            </Card>
          </Col>
          <Col xs={24} md={12} lg={6} className={styles["row-gap"]}>
            <Card>
              <p className={styles["card-title"]}>48</p>
              <p className={styles["card-description"]}>Available Licenses</p>
            </Card>
          </Col>
          <Col xs={24} md={12} lg={6} className={styles["row-gap"]}>
            <Card>
              <p className={styles["card-title"]}>10</p>
              <p className={styles["card-description"]}>Free Trial Users</p>
            </Card>
          </Col>
        </Row>
      </div>

      <Space direction="vertical" size="small" className={styles.main}>
        <Flex gap={4} align="center">
          <p className={styles.heading}>Notifications</p>
          <IconRefresh size={18} />
          <IconFileExcel size={18} />
          <IconExternalLink size={18} />
        </Flex>
        <div style={{marginTop: '5%' }}>
      <h3>Manage Users</h3>
      <GridComponent  
        dataSource={data} height={300}
        toolbar={toolbarOptions} 
        allowPaging={true} pageSettings={pageSettings}
        allowExcelExport={true} allowPdfExport={true} toolbarClick={toolbarClick} 
        editSettings={editOptions}
        actionComplete={actionComplete}  ref={g => grid = g}>
        <ColumnsDirective>
          <ColumnDirective headerText='Picture' width='50' template={pictureTemplate} textAlign='Center'  editTemplate={pictureEditTemplate}/>
          {/* <ColumnDirective field='user_id' headerText='Order ID' width='50' type="number" textAlign="Right" isPrimaryKey={true} /> */}
          <ColumnDirective field='user_email' headerText='User Name' textAlign='Right' width='150' type="string" />
          <ColumnDirective field='License Assigned' headerText='License Assigned' width='100' type="boolean" template={toggleTemplate} allowEditing={false} />
          <ColumnDirective field='full_name' headerText='Full Name' width='100' type="string" editType="stringedit"/>
          <ColumnDirective field='creation_date' headerText='Date Signed up' type='date' editType="datepickeredit" format='yMd' width='100' />
          <ColumnDirective field="user_type" headerText="User Type" width='100' editType="dropdownedit"/>
          <ColumnDirective field="last_update_date" headerText="Last Login Date" type='date' editType="datepickeredit" format='yMd' width='100'/>
          <ColumnDirective field="PasswordReset" headerText="Password Reset"  width='100'
                    // commands={ResetTemplate(user_id)}
                    // commands={[{ template: ResetTemplate }]}
                    // commands={[ { buttonOption: { content: 'Reset' } }]} template={handleButtonClick}
                    template={ResetTemplate}

          //  template={() => <button onClick={() => handleButtonClick()}>Reset</button>}
            allowEditing={false} />
          <ColumnDirective field="admin_role" headerText="Admin Role"  width='100' template={toggleTemplate} allowEditing={false} />
          <ColumnDirective headerText='Actions' width='100' commands={[{ type: 'Edit', buttonOption: { iconCss: 'e-icons e-edit', cssClass: 'e-flat' } }, { buttonOption: { iconCss: 'e-icons e-eye', cssClass: 'e-flat' } }]} template={commandTemplate} />
       </ColumnsDirective>
        <Inject services={[Edit, Page,  Toolbar, CommandColumn, ExcelExport, PdfExport, Search]} />
      </GridComponent>
    </div>
      </Space>
    </Space>
  );
};

export { ManageSubscriptionsTab };
