import { Space, Collapse, Flex, Table, Tag, Button } from "antd";
import type { TableProps } from "antd";
import { Row, Col, Typography } from 'antd';
const { Title } = Typography;
import {
  IconExternalLink,
  IconFileExcel,
  IconRefresh,
  IconHelp,
  IconHeadphonesFilled,
} from "@tabler/icons-react";
import styles from "./styles.module.css";
import {
  GridComponent,
  ColumnsDirective,
  ColumnDirective,
  Edit,
  Inject,
  Toolbar,
  Filter,
  CommandColumn,
  Page,
  ExcelExport,
  PdfExport,
  Search,
  EditSettingsModel
} from '@syncfusion/ej2-react-grids';
import React, { useState, useEffect } from 'react';
import { TooltipComponent } from '@syncfusion/ej2-react-popups';
import { ClickEventArgs } from '@syncfusion/ej2-navigations';
import { registerLicense } from '@syncfusion/ej2-base';
import { DialogComponent } from '@syncfusion/ej2-react-popups';

const TechSupportTab = () => {
  interface DataType {
    key: string;
    name: string;
    age: number;
    address: string;
    tags: string[];
  }
  // Define the Holiday interface
  interface Enquires {
    message_id: number;
    subject: string;
    message: string;
    ticket_status: string;
  }
  // Sample data for customer enquiries
  const [enquiries, setEnquiries] = useState<Enquires[]>([]);
  const [selectedRecord, setSelectedRecord] = useState<any>(null);
  const [dialogVisible, setDialogVisible] = useState(false);
  const token = localStorage.getItem('bearerToken') || '';
  const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const [loading, setLoading] = useState<boolean>(false);



  registerLicense('Ngo9BigBOggjHTQxAR8/V1NCaF1cVGhIfEx1RHxQdld5ZFRHallYTnNWUj0eQnxTdEFjUX5XcHVVQ2NfUUR2Vg==');
  let grid: GridComponent | null;
  const toolbarOptions = ['ExcelExport', 'PdfExport'];
  const baseURL = `${process.env.REACT_APP_BACKEND_URL || ""}api/`;


  const fetchData = async () => {
    try {
      const response = await fetch(baseURL+'support', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      const result = await response.json(); // Assuming the API returns JSON data
      setEnquiries(result); // Update state with the fetched data
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    const getData = async () => {
      const result = await fetchData();  // Call the fetchData function
    };
    getData();
  }, []);

  const toolbarClick = (args: ClickEventArgs) => {

    if (grid && args.item.id?.includes('pdfexport')) {
      grid.pdfExport({
        fileName: 'tech-support.pdf',
        theme: {
          header: { bold: true, fontColor: '#454545', fontName: 'Calibri', fontSize: 10 },
          record: { fontColor: '#1D1D1D', fontName: 'Calibri', fontSize: 8 }
        }
      });
    } else if (grid && args.item.id?.includes('excelexport')) {
      grid.excelExport({
        fileName: 'tech-support.xlsx',
        theme: {
          header: { bold: true, fontColor: '#454545', fontName: 'Calibri', fontSize: 10 },
          record: { fontColor: '#1D1D1D', fontName: 'Calibri', fontSize: 8 }
        }
      });

    }
  }
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

  // State to hold form values
  const [formData, setFormData] = useState({
    subject: '',
    message: '',
    timezone: userTimezone
  });

  // Handle input change
  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle form submission
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    // Process form data here (e.g., send it to an API)
    console.log('Form submitted:', formData);
    setLoading(true);
    try {
      const response = await fetch(baseURL+'support', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const newData = await fetchData();  // Re-fetch all data after update
        // Clear the form by resetting state
        setFormData({
          subject: '',
          message: '',
          timezone: userTimezone
        });
      } else {
        console.error('Failed to save the data.');
      }
    } catch (error) {
      console.error('Error while saving the data:', error);
    }finally {
      setLoading(false);
    }
  };

  // Handle row click event
  const handleRowClick = (args: any) => {
    const record = args;  // Get the clicked record
    setSelectedRecord(record);    // Set the selected record to display in dialog
    setDialogVisible(true);       // Open the dialog
  };


  return (
    <div  className={styles.container}>
       <Space direction="vertical" size="large" className={styles.main}>
        {/* <div className={styles.supportForm}> */}
        <Space direction="vertical" size="small" className={styles.main + ' ' + styles.spaceItem}>
          <p>
            <b>IMPORTANT! </b>Please allow us 24 hours turn around time to respond to your message!
          </p>
          <form onSubmit={handleSubmit} style={formStyle}>
            <div style={fieldStyle}>
              <label htmlFor="subject">Subject:</label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                style={inputStyle}
                required
              />
            </div>
            <div style={fieldStyle}>
              <label htmlFor="message">Message:</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                style={textareaStyle}
                rows={5}
                required
              />
            </div>
            <button className={styles.submitbutton} type="submit" disabled={loading}>
                {loading ? 'Submiting ...' : 'Submit'}
              </button>
          </form>
        </Space>
        <Space direction="vertical" size="small" className={styles.main + ' ' + styles.spaceItem}>
          <Title level={4}>Service Requests </Title>
          <GridComponent
            dataSource={enquiries}  // Data source for the grid
            // rowSelected={handleRowClick} // Event for row selection
            toolbar={toolbarOptions}  // Include search in the toolbar
            // editSettings={editSettings}
            // allowPaging={true} pageSettings={{ pageSize: 20 }}
            allowExcelExport={true} allowPdfExport={true} toolbarClick={toolbarClick}
            // allowFiltering={true} // Enable filtering
            // filterSettings={{ type: 'FilterBar', mode: 'Immediate', immediateModeDelay: 100 }} // Set filter bar for each column
            height={300}
            ref={g => grid = g}>
            <ColumnsDirective>
              <ColumnDirective field='message_id' headerText='ID' width='50' textAlign='Right' isPrimaryKey={true}
                template={(props: any) => (
                  <a onClick={() => handleRowClick(props)}>{props.message_id}</a>
                )} />
              <ColumnDirective field='subject' headerText='Subject' width='200' textAlign='Left' />
              <ColumnDirective field='message' headerText='Message' width='500' textAlign='Left' />
              <ColumnDirective field='ticket_status' headerText='Priority' width='150' textAlign='Left' />
              <ColumnDirective headerText='Action' width='100' allowEditing={false} template={commandTemplate} />
            </ColumnsDirective>
            <Inject services={[Toolbar, ExcelExport, PdfExport]} />
          </GridComponent>

          {/* Dialog for showing record details */}
          <DialogComponent
            visible={dialogVisible}
            header="Support Details"
            width='550px'
            showCloseIcon={true}
            close={() => setDialogVisible(false)} // Close the dialog
          >
            {selectedRecord && (
              <div className={styles.ModalClass}>
                <p><strong>ID:</strong> {selectedRecord.message_id}</p>
                <p><strong>Subject:</strong> {selectedRecord.subject}</p>
                <p><strong>Message:</strong> {selectedRecord.message}</p>
              </div>
            )}
          </DialogComponent>
        </Space>
      </Space>
    </div>
   
  );
};
// Inline styles for simplicity (you can move this to a CSS file)
const formStyle = {
  maxWidth: '650',
  margin: '30px',
  padding: '20px',
  border: '1px solid #ccc',
  borderRadius: '5px',
  backgroundColor: '#f9f9f9'
};

const fieldStyle = {
  marginBottom: '15px'
};

const inputStyle = {
  width: '100%',
  padding: '10px',
  borderRadius: '4px',
  border: '1px solid #ccc'
};

const textareaStyle = {
  width: '100%',
  padding: '10px',
  borderRadius: '4px',
  border: '1px solid #ccc'
};

const buttonStyle = {
  padding: '10px 20px',
  borderRadius: '4px',
  border: 'none',
  backgroundColor: '#28a745',
  color: '#fff',
  cursor: 'pointer'
};


export { TechSupportTab };
