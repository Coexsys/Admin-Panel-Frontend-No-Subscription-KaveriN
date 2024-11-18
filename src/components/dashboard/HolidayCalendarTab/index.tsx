// import { Space, Select, Table, Tag, } from "antd";
// import type { TableProps } from "antd";
// import styles from "./styles.module.css";
// import { Row, Col, Typography } from 'antd';
// const { Title } = Typography;


// import {
//   GridComponent,
//   ColumnsDirective,
//   ColumnDirective,
//   Edit,
//   Inject,
//   Toolbar,
//   CommandColumn,
//   Page,
//   ExcelExport,
//   PdfExport,
//   Search,
//   EditSettingsModel
// } from '@syncfusion/ej2-react-grids';
// import React, { useState, useEffect } from 'react';
// import { TooltipComponent } from '@syncfusion/ej2-react-popups';
// import { ClickEventArgs } from '@syncfusion/ej2-navigations';
// import { registerLicense } from '@syncfusion/ej2-base';
// import { DialogComponent } from '@syncfusion/ej2-react-popups';



// const HolidayCalendarTab = () => {
//   interface DataType {
//     key: string;
//     name: string;
//     age: number;
//     address: string;
//     tags: string[];
//   }
//   // Define the Holiday interface
//   interface Holiday {
//     holiday_id: number;
//     holiday_date: string;
//     holiday_name: string;
//   }
//   registerLicense('Ngo9BigBOggjHTQxAR8/V1NCaF1cVGhIfEx1RHxQdld5ZFRHallYTnNWUj0eQnxTdEFjUX5XcHVVQ2NfUUR2Vg==');
//   const token = localStorage.getItem('bearerToken') || '';
//   const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
//   const baseURL = `${process.env.REACT_APP_BACKEND_URL || ""}api/`;

//   const [holidays, setHolidays] = useState<Holiday[]>([]);
//   const [selectedValue, setSelectedValue] = useState<number | null>(null);
//   const [selectedRecord, setSelectedRecord] = useState<any>(null);
//   const [dialogVisible, setDialogVisible] = useState(false);

//   let grid: GridComponent | null;
//   const editOptions: EditSettingsModel = { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Dialog' };
//   const toolbarOptions = ['Add', 'Edit', 'Delete', 'ExcelExport', 'PdfExport', 'Search'];

//   const toolbarClick = (args: ClickEventArgs) => {
//     if (grid && args.item.id?.includes('pdfexport')) {
//       grid.pdfExport({
//         fileName: 'holiday-list.pdf',
//         theme: {
//           header: { bold: true, fontColor: '#454545', fontName: 'Calibri', fontSize: 10 },
//           record: { fontColor: '#1D1D1D', fontName: 'Calibri', fontSize: 8 }
//         }
//       });
//     } else if (grid && args.item.id?.includes('excelexport')) {
//       grid.excelExport({
//         fileName: 'holiday-list.xlsx',
//         theme: {
//           header: { bold: true, fontColor: '#454545', fontName: 'Calibri', fontSize: 10 },
//           record: { fontColor: '#1D1D1D', fontName: 'Calibri', fontSize: 8 }
//         }
//       });

//     }
//   }
//   const fetchData = async (year: any) => {
//     try {
//       const response = await fetch(baseURL + `holidays/${year}`, {
//         method: 'GET',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`,
//         },
//       });
//       const result = await response.json(); // Assuming the API returns JSON data
//       setHolidays(result); // Update state with the fetched data
//     } catch (error) {
//       console.error('Error fetching data:', error);
//     }
//   };

//   useEffect(() => {
//     const getData = async () => {
//       const selected = 2024
//       setSelectedValue(selected);
//       const result = await fetchData(2024);  // Call the fetchData function
//     };
//     getData();
//   }, []);

//   const handleChange = async (option: any) => {
//     setSelectedValue(option);
//     try {
//       const result = await fetchData(option);  // Call the fetchData function
//     } catch (error) {
//       console.error('Error sending data to the backend:', error);
//     }

//   };
//   function commandTemplate(props: any): any {
//     const tooltipContent = `<span id='tooltipContent'><strong>Created By:</strong> ${props.created_by}<br><strong>Updated By:</strong> ${props.last_updated_by}<br><strong>Creation Date:</strong> ${props.created_with_timezone}<br><strong>Update Date:</strong> ${props.last_update_with_timezone}</span>`;
//     return (
//       <div style={{ display: 'flex', gap: '10px' }}>
//         <TooltipComponent className="tooltip-box" content={tooltipContent} position="TopCenter" openDelay={100} closeDelay={10} cssClass='customtip'>
//           <div className="e-flat e-eye e-icons e-medium"></div>
//         </TooltipComponent>
//       </div>
//     );
//   };
//   const year = selectedValue ? selectedValue : 2024; // Fallback to 2023 if selectedValue is empty or invalid

//   const orderDateParams = {
//     params: {
//       // format: 'M/d/yyyy', // Set the display format if necessary
//       // value: new Date(2024, 0, 1), // Default date value
//       min: new Date(2024, 0, 1),   // Minimum date allowed
//       max: new Date(2024, 11, 31), // Maximum date allowed
//     },
//   };
//   // Check if holiday exists
//   const isHolidayDuplicate = (newHoliday: Holiday) => {
//     console.log(holidays.some(holiday => holiday.holiday_date == newHoliday.holiday_date))
//     return holidays.some(holiday => holiday.holiday_date === newHoliday.holiday_date);
//   };
//   const actionComplete = async (args: any) => {
//     if (args.requestType === 'save' && args.action === 'add') {
//       args.data = {
//         ...args.data,
//         created_timezone: userTimezone,
//         holiday_year: selectedValue // Adding the file content as a new key-value pair
//       };
//       // Get the holiday data being created or edited
//       const newHoliday = args.data; // Explicitly typecast args.data
//       if (isHolidayDuplicate(newHoliday)) {
//         alert('Holiday already exists in the database!');
//         args.cancel = true; // Prevent API call
//         return false;
//       }
//       try {
//         const response = await fetch(baseURL + 'holidays', {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//             'Authorization': `Bearer ${token}`,
//           }, body: JSON.stringify(args.data),
//         });

//         if (response.ok) {
//           const newData = await fetchData(selectedValue);  // Re-fetch all data after update
//         } else {
//           console.error('Failed to save the data.');
//         }
//       } catch (error) {
//         console.error('Error while saving the data:', error);
//       }
//     } else if (args.requestType === 'save' && args.action === 'edit') {
//       args.data = {
//         ...args.data,
//         updated_timezone: userTimezone,
//         holiday_year: selectedValue // Adding the file content as a new key-value pair
//       };
//       const newHoliday = args.data as Holiday; // Explicitly typecast args.data
//       if (isHolidayDuplicate(newHoliday)) {
//         alert('Holiday already exists in the database!');
//         args.cancel = true; // Prevent API call
//         return false;
//       }

//       try {
//         const updateUser = args.data.holiday_id;

//         const response = await fetch(baseURL + `holidays/edit/${updateUser}`, {
//           method: 'POST',
//           headers: {
//             'Authorization': `Bearer ${token}`,

//           },
//           body: JSON.stringify(args.data),
//         });

//         if (response.ok) {
//           const newData = await fetchData(selectedValue);  // Re-fetch all data after update
//         } else {
//           console.error('Failed to save the data.');
//         }
//       } catch (error) {
//         console.error('Error while saving the data:', error);
//       }
//     } else if (args.requestType === 'delete') {

//       args.data = {
//         ...args.data,
//         holiday_year: selectedValue // Adding the file content as a new key-value pair
//       };
//       try {
//         const holidayId = args.data[0].holiday_id;

//         const response = await fetch(baseURL + `holidays/delete/${holidayId}`, {
//           method: 'POST',
//           headers: {
//             'Authorization': `Bearer ${token}`,

//           },
//           // body:  JSON.stringify(args.data),
//         });

//         if (response.ok) {
//           const newData = await fetchData(selectedValue);  // Re-fetch all data after update
//         } else {
//           console.error('Failed to save the data.');
//         }
//       } catch (error) {
//         console.error('Error while saving the data:', error);
//       }
//     }
//   };
//   // Options for the select component
//   const options = [
//     { value: '', label: 'Select an option' },
//     { value: '2022', label: '2022' },
//     { value: '2023', label: '2023' },
//     { value: '2024', label: '2024' },
//   ];

//   // Handle row click event
//   const handleRowClick = (args: any) => {
//     const record = args;  // Get the clicked record
//     setSelectedRecord(record);    // Set the selected record to display in dialog
//     setDialogVisible(true);       // Open the dialog
//   };

//   return (
//     <div className={styles.container}>
//       <Space direction="vertical" size="large" className={styles.main}>
//       <Space direction="vertical" size="small" className={styles.main + ' ' + styles.spaceItem}>
//       <Row justify="space-between" align="middle">
//               <Col>
//               <Title level={4}>Holidays </Title>
//               </Col>
//               <Col>
//               <Select
//           value={selectedValue} // Set the value to the state
//           onChange={handleChange} // Handle the change event
//           options={options} // Pass the options to the select component
//         />
//               </Col>
//             </Row>
//           <GridComponent
//             dataSource={holidays} height={300}
//             toolbar={toolbarOptions}
//             allowPaging={true} pageSettings={{ pageSize: 20 }}
//             allowExcelExport={true} allowPdfExport={true} toolbarClick={toolbarClick}
//             editSettings={editOptions}
//             actionComplete={actionComplete}
//             ref={g => grid = g}>
//             <ColumnsDirective>
//               <ColumnDirective field="holiday_id" headerText="ID" isPrimaryKey={true} width="100" textAlign="Right"
//                 template={(props: any) => (
//                   <a onClick={() => handleRowClick(props)}>{props.holiday_id}</a>
//                 )}
//                 allowEditing={false} />
//               <ColumnDirective field="holiday_name" headerText="Holiday Name" width="200" validationRules={{ required: true }} />
//               <ColumnDirective field="holiday_date" headerText="Date" width="200" format="yMd" type="date" editType="datepickeredit" validationRules={{ required: true }} edit={orderDateParams} />
//               <ColumnDirective headerText='Action' width='100' allowEditing={false} template={commandTemplate} />
//             </ColumnsDirective>
//             <Inject services={[Edit, Page, Toolbar, CommandColumn, ExcelExport, PdfExport, Search]} />
//           </GridComponent>
//         </Space>
//         {/* Dialog for showing record details */}
//         <DialogComponent
//           visible={dialogVisible}
//           header="Holiday Details"
//           width='400px'
//           showCloseIcon={true}
//           close={() => setDialogVisible(false)} // Close the dialog
//         >
//           {selectedRecord && (
//             <div className={styles.ModalClass}>
//               <p><strong>ID:</strong> {selectedRecord.holiday_id}</p>
//               <p><strong>Name:</strong> {selectedRecord.holiday_name}</p>
//               <p><strong>Date:</strong> {selectedRecord.holiday_date}</p>
//             </div>
//           )}
//         </DialogComponent>
//       </Space>
//     </div>
//   );
// };

// export { HolidayCalendarTab };
// import React, { useState, useEffect } from 'react';
// import { Space, Select, Calendar, Modal, Form, Input, DatePicker, message } from 'antd';
// import { PlusOutlined } from '@ant-design/icons';
// import dayjs, { Dayjs } from 'dayjs';
// import {
//   GridComponent,
//   ColumnsDirective,
//   ColumnDirective,
//   Edit,
//   Inject,
//   Toolbar,
//   CommandColumn,
//   Page,
//   ExcelExport,
//   PdfExport,
//   Search,
//   EditSettingsModel
// } from '@syncfusion/ej2-react-grids';
// import { TooltipComponent } from '@syncfusion/ej2-react-popups';
// import { registerLicense } from '@syncfusion/ej2-base';
// import { Row, Col, Typography } from 'antd';
// const { Title } = Typography;

// interface Holiday {
//   holiday_id: number;
//   holiday_date: string;
//   holiday_name: string;
//   created_by?: string;
//   last_updated_by?: string;
//   created_with_timezone?: string;
//   last_update_with_timezone?: string;
// }

// interface YearOption {
//   value: string;
//   label: string;
// }

// const HolidayCalendarTab: React.FC = () => {
//   // Register Syncfusion license
//   registerLicense('Ngo9BigBOggjHTQxAR8/V1NCaF1cVGhIfEx1RHxQdld5ZFRHallYTnNWUj0eQnxTdEFjUX5XcHVVQ2NfUUR2Vg==');

//   // State management
//   const [holidays, setHolidays] = useState<Holiday[]>([]);
//   const [selectedYear, setSelectedYear] = useState<string>(dayjs().year().toString());
//   const [yearOptions, setYearOptions] = useState<YearOption[]>([]);
//   const [isCalendarModalVisible, setIsCalendarModalVisible] = useState(false);
//   const [isAddYearModalVisible, setIsAddYearModalVisible] = useState(false);
//   const [selectedHoliday, setSelectedHoliday] = useState<Holiday | null>(null);
//   const [form] = Form.useForm();

//   const token = localStorage.getItem('bearerToken') || '';
//   const baseURL = `${process.env.REACT_APP_BACKEND_URL || ""}api/`;
//   const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

//   // Grid configuration
//   const editOptions: EditSettingsModel = {
//     allowEditing: true,
//     allowAdding: true,
//     allowDeleting: true,
//     mode: 'Dialog'
//   };

//   const toolbarOptions = ['Add', 'Edit', 'Delete', 'ExcelExport', 'PdfExport', 'Search'];
//   let gridRef: GridComponent | null = null;

//   // Fetch available years and holidays
//   useEffect(() => {
//     fetchYears();
//     if (selectedYear) {
//       fetchHolidays(selectedYear);
//     }
//   }, [selectedYear]);

//   const fetchYears = async () => {
//     try {
//       const response = await fetch(`${baseURL}holidays/years`, {
//         headers: { 'Authorization': `Bearer ${token}` }
//       });
//       const years = await response.json();
//       const options = years.map((year: string) => ({ value: year, label: year }));
//       options.push({ value: 'add', label: '+ Add New Year' });
//       setYearOptions(options);
//     } catch (error) {
//       message.error('Failed to fetch years');
//     }
//   };

//   const fetchHolidays = async (year: string) => {
//     try {
//       const response = await fetch(`${baseURL}holidays/${year}`, {
//         headers: { 'Authorization': `Bearer ${token}` }
//       });
//       const data = await response.json();
//       setHolidays(data);
//     } catch (error) {
//       message.error('Failed to fetch holidays');
//     }
//   };

//   // Year selection handling
//   const handleYearChange = (value: string) => {
//     if (value === 'add') {
//       setIsAddYearModalVisible(true);
//     } else {
//       setSelectedYear(value);
//     }
//   };

//   // Add new year
//   // const handleAddYear = (values: { year: string }) => {
//   //   const newYear = values.year;
//   //   setYearOptions(prev => [...prev.filter(opt => opt.value !== 'add'), 
//   //     { value: newYear, label: newYear },
//   //     { value: 'add', label: '+ Add New Year' }
//   //   ]);
//   //   setSelectedYear(newYear);
//   //   setIsAddYearModalVisible(false);
//   //   form.resetFields();
//   // };

//   const handleAddYear = (values: { year: string }) => {
//     const newYear = values.year;

//     // Add validation
//     if (yearOptions.some(opt => opt.value === newYear)) {
//       message.error('This year already exists in the dropdown!');
//       return;
//     }

//     // Update options with sorting
//     setYearOptions(prev => {
//       const updatedOptions = [
//         ...prev.filter(opt => opt.value !== 'add'),
//         { value: newYear, label: newYear }
//       ].sort((a, b) => {
//         if (a.value === 'add') return 1;
//         if (b.value === 'add') return -1;
//         return parseInt(b.value) - parseInt(a.value);
//       });

//       // Add "Add New Year" option at the end
//       updatedOptions.push({ value: 'add', label: '+ Add New Year' });

//       return updatedOptions;
//     });

//     setSelectedYear(newYear);
//     setIsAddYearModalVisible(false);
//     form.resetFields();
//   };

//   // Calendar date cell rendering with Day.js
//   const dateCellRender = (date: Dayjs) => {
//     const holiday = holidays.find(h => 
//       dayjs(h.holiday_date).format('YYYY-MM-DD') === date.format('YYYY-MM-DD')
//     );

//     if (holiday) {
//       return (
//         <div className="ant-calendar-date holiday-date">
//           <span className="holiday-name">{holiday.holiday_name}</span>
//         </div>
//       );
//     }
//     return null;
//   };

//   // Grid command template
//   const commandTemplate = (props: Holiday) => {
//     const tooltipContent = `
//       <div>
//         <p><strong>Created By:</strong> ${props.created_by}</p>
//         <p><strong>Updated By:</strong> ${props.last_updated_by}</p>
//         <p><strong>Created:</strong> ${props.created_with_timezone}</p>
//         <p><strong>Updated:</strong> ${props.last_update_with_timezone}</p>
//       </div>
//     `;

//     return (
//       <div className="grid-command-column">
//         <TooltipComponent content={tooltipContent} position="TopCenter">
//           <button 
//             className="view-button"
//             onClick={() => {
//               setSelectedHoliday(props);
//               setIsCalendarModalVisible(true);
//             }}
//           >
//             View
//           </button>
//         </TooltipComponent>
//       </div>
//     );
//   };

//   // Grid action handling
//   const actionComplete = async (args: any) => {
//     if (args.requestType === 'save') {
//       const isNewRecord = args.action === 'add';
//       const endpoint = isNewRecord ? 'holidays' : `holidays/edit/${args.data.holiday_id}`;

//       try {
//         const response = await fetch(`${baseURL}${endpoint}`, {
//           method: 'POST',
//           headers: {
//             'Authorization': `Bearer ${token}`,
//             'Content-Type': 'application/json',
//           },
//           body: JSON.stringify({
//             ...args.data,
//             holiday_year: selectedYear,
//             [isNewRecord ? 'created_timezone' : 'updated_timezone']: userTimezone,
//           }),
//         });

//         if (response.ok) {
//           message.success(`Holiday ${isNewRecord ? 'added' : 'updated'} successfully`);
//           fetchHolidays(selectedYear);
//         } else {
//           message.error('Operation failed');
//         }
//       } catch (error) {
//         message.error('An error occurred');
//       }
//     } else if (args.requestType === 'delete') {
//       try {
//         const response = await fetch(`${baseURL}holidays/delete/${args.data[0].holiday_id}`, {
//           method: 'POST',
//           headers: {
//             'Authorization': `Bearer ${token}`,
//           },
//         });

//         if (response.ok) {
//           message.success('Holiday deleted successfully');
//           fetchHolidays(selectedYear);
//         } else {
//           message.error('Deletion failed');
//         }
//       } catch (error) {
//         message.error('An error occurred');
//       }
//     }
//   };

//   return (
//     <div className="holiday-calendar-container">
//       <Space direction="vertical" size="large" style={{ width: '100%' }}>
//         <Row justify="space-between" align="middle">
//           <Col>
//             <Title level={4}>Holiday Calendar</Title>
//           </Col>
//           <Col>
//             <Select
//               style={{ width: 200 }}
//               value={selectedYear}
//               onChange={handleYearChange}
//               options={yearOptions}
//             />
//           </Col>
//         </Row>

//         <GridComponent
//           dataSource={holidays}
//           height={400}
//           toolbar={toolbarOptions}
//           editSettings={editOptions}
//           actionComplete={actionComplete}
//           ref={grid => gridRef = grid}
//         >
//           <ColumnsDirective>
//             <ColumnDirective 
//               field="holiday_id" 
//               headerText="ID" 
//               isPrimaryKey={true} 
//               width="100"
//             />
//             <ColumnDirective 
//               field="holiday_name" 
//               headerText="Holiday Name" 
//               width="200"
//             />
//             <ColumnDirective 
//               field="holiday_date" 
//               headerText="Date" 
//               width="200" 
//               format="yMd" 
//               type="date"
//             />
//             <ColumnDirective 
//               headerText="Actions" 
//               width="100" 
//               template={commandTemplate}
//             />
//           </ColumnsDirective>
//           <Inject services={[Edit, Page, Toolbar, CommandColumn, ExcelExport, PdfExport, Search]} />
//         </GridComponent>

//         {/* Calendar Modal */}
//         <Modal
//           title="Holiday Calendar View"
//           open={isCalendarModalVisible}
//           onCancel={() => setIsCalendarModalVisible(false)}
//           footer={null}
//           width={800}
//         >
//           <Calendar
//             dateCellRender={dateCellRender}
//             defaultValue={dayjs(selectedYear)}
//             mode="month"
//           />
//         </Modal>

//         {/* Add Year Modal */}
//         <Modal
//           title="Add New Year"
//           open={isAddYearModalVisible}
//           onCancel={() => setIsAddYearModalVisible(false)}
//           onOk={() => form.submit()}
//         >
//           <Form
//             form={form}
//             onFinish={handleAddYear}
//           >
//             <Form.Item
//               name="year"
//               label="Year"
//               rules={[
//                 { required: true, message: 'Please input the year!' },
//                 { pattern: /^\d{4}$/, message: 'Please enter a valid year!' }
//               ]}
//             >
//               <Input placeholder="YYYY" />
//             </Form.Item>
//           </Form>
//         </Modal>
//       </Space>
//     </div>
//   );
// };
// export { HolidayCalendarTab };

import React, { useState, useEffect, useRef  } from 'react';
import { Select, Button, Modal, Input, message, Space, Row, Col, Typography, DatePicker } from 'antd';
import {
  GridComponent,
  ColumnsDirective,
  ColumnDirective,
  Inject,
  Toolbar,
  Edit,
  Page,
  ExcelExport,
  PdfExport,
} from '@syncfusion/ej2-react-grids';
import { EditSettingsModel } from '@syncfusion/ej2-react-grids';
import { Calendar } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { registerLicense } from '@syncfusion/ej2-base';
const baseURL = `${process.env.REACT_APP_BACKEND_URL || ""}api/`;


const { Title } = Typography;

interface Holiday {
  holiday_id: number;
  holiday_date: string;
  holiday_name: string;
}

const HolidayCalendarTab: React.FC = () => {
  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const [years, setYears] = useState<number[]>([2020, 2021, 2022, 2023, 2024, 2025, 2026, 2027, 2028, 2029, 2030]); // Initial list of years
  const [selectedYear, setSelectedYear] = useState<number>(2024);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [calendarVisible, setCalendarVisible] = useState(false);
  const [yearModalVisible, setYearModalVisible] = useState(false);
  const [newYear, setNewYear] = useState<string>('');
  const [holidayName, setHolidayName] = useState<string>('');
  const [holidayDate, setHolidayDate] = useState<Dayjs | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingHolidayId, setEditingHolidayId] = useState<number | null>(null);
  const gridRef = useRef<GridComponent>(null);


  registerLicense('Ngo9BigBOggjHTQxAR8/V1NCaF1cVGhIfEx1RHxQdld5ZFRHallYTnNWUj0eQnxTdEFjUX5XcHVVQ2NfUUR2Vg==');
  const token = localStorage.getItem('bearerToken') || '';

  const editOptions: EditSettingsModel = { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Dialog' };

  const fetchData = async (year: number) => {
    try {
      const response = await fetch(baseURL + `holidays/${year}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      const result = await response.json(); // Assuming the API returns JSON data
      setHolidays(result); // Update state with the fetched data
    } catch (error) {
      console.error('Error fetching data:', error);
    }
    // Fetch holiday data from the API for the selected year
    // setHolidays(fetchedData); // Update holidays state with data from backend
  };

  useEffect(() => {
    fetchData(selectedYear);
  }, [selectedYear]);

  const handleYearChange = (value: number) => {
    setSelectedYear(value);
    fetchData(value);
  };

  const openAddYearModal = () => {
    setYearModalVisible(true);
  };

  const handleAddYear = () => {
    setLoading(true);
    const parsedYear = parseInt(newYear, 10);
    if (isNaN(parsedYear) || parsedYear < 1900 || parsedYear > 2100) {
      message.error('Please enter a valid year between 1900 and 2100');
      return;
    }
    if (!years.includes(parsedYear)) {
      setYears([...years, parsedYear]);
      setSelectedYear(parsedYear);
      fetchData(parsedYear);
      message.success(`Year ${parsedYear} added successfully`);
      setLoading(false);
    } else {
      message.info(`Year ${parsedYear} already exists`);
    }
    setYearModalVisible(false);
    setNewYear('');
  };
  // Disable dates outside the selected year range
  const disableDatesOutsideSelectedYear = (currentDate: any) => {
    // Disable dates that are not in the selected year
    return currentDate.year() !== selectedYear;
  };

  const openAddDialog = () => {
    setDialogVisible(true);
  };

  const openCalendarDialog = () => {
    setCalendarVisible(true);
  };

  const handleSaveHoliday = async () => {
    if (holidayName && holidayDate) {
      const newHoliday = {
        holiday_id: editingHolidayId,
        holiday_date: holidayDate.format('YYYY-MM-DD'),
        holiday_name: holidayName,
        holiday_year: selectedYear,
      };
      if (isEditing) {
        try {
          setLoading(true);
          const response = await fetch(baseURL + `holidays/edit/${editingHolidayId}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            }, body: JSON.stringify(newHoliday),
          });

          if (response.ok) {
            const index = holidays.findIndex((holiday) => holiday.holiday_id === newHoliday.holiday_id);

            if (index !== -1) {
              // Replace the old holiday with the updated one in the holidays array
              const updatedHolidays = [
                ...holidays.slice(0, index),
                newHoliday,
                ...holidays.slice(index + 1)
              ];

              // Update the state with the modified holidays array
              setHolidays(updatedHolidays);
            } else {
              // If the holiday is new, add it to the array
              setHolidays([...holidays, newHoliday]);
            }

            // setHolidays([...holidays, newHoliday]);
            setDialogVisible(false);
            setHolidayName('');
            setHolidayDate(null);
            // const newData = await fetchData(selectedValue);  // Re-fetch all data after update
          } else {
            console.error('Failed to save the data.');
          }
        } catch (error) {
          console.error('Error while saving the data:', error);
        } finally {
          setLoading(false);
        }

      } else {
        try {
          setLoading(true);
          const response = await fetch(baseURL + 'holidays', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            }, body: JSON.stringify(newHoliday),
          });

          if (response.ok) {
            setHolidays([...holidays, newHoliday]);
            setDialogVisible(false);
            setHolidayName('');
            setHolidayDate(null);
            // const newData = await fetchData(selectedValue);  // Re-fetch all data after update
          } else {
            console.error('Failed to save the data.');
          }
        } catch (error) {
          console.error('Error while saving the data:', error);
        } finally {
          setLoading(false);
        }

      }

    }
  };

  const handleRowEdit = (record: Holiday) => {
    setHolidayName(record.holiday_name);
    setHolidayDate(dayjs(record.holiday_date));
    // setIsEditing(true);
    // setEditingHolidayId(record.holiday_id);
    // setDialogVisible(true);
    setCalendarVisible(true); // Open calendar modal to view/edit holidays in a calendar view
  };
  const actionBegin = async (args: any) => {
    if (args.requestType === 'beginEdit') {
      setHolidayName(args.rowData.holiday_name);
      setHolidayDate(dayjs(args.rowData.holiday_date));
      setIsEditing(true);
      setEditingHolidayId(args.rowData.holiday_id);
      setDialogVisible(true);
      setDialogVisible(true);
      args.cancel = true;
    }
    if (args.requestType === 'add') {
      setEditingHolidayId(null);
      setDialogVisible(true);
      setIsEditing(false);
      args.cancel = true;
    }
    if (args.requestType === 'delete') {
      const { data } = args;
      const holidayIdToDelete = data[0].holiday_id; // Assuming only one row is selected for deletion

      Modal.confirm({
        title: 'Are you sure you want to delete this holiday?',
        content: `Holiday: ${data[0].holiday_name} on ${data[0].holiday_date}`,
        okText: 'Yes',
        cancelText: 'No',
        async onOk() {
          try {
            const response = await fetch(`${baseURL}holidays/delete/${holidayIdToDelete}`, {
              method: 'DELETE',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
              },
            });

            if (response.ok) {
              setHolidays(holidays.filter((holiday) => holiday.holiday_id !== holidayIdToDelete));
              message.success('Holiday deleted successfully');
            } else {
              message.error('Failed to delete holiday');
            }
          } catch (error) {
            console.error('Error deleting holiday:', error);
            message.error('An error occurred while deleting the holiday');
          }
        },
        onCancel() {
          args.cancel = true;
        },
      });
    }

  };
  const handleDialogClose = () => setDialogVisible(false);
  const toolbarOptions = ['Add', 'Edit', 'Delete', 'ExcelExport', 'PdfExport',];
  const toolbarClick = (args: any) => {
    console.log( args.item.properties.id);
    if (gridRef && args.item.properties.id?.includes('excelexport')) {
      gridRef.current?.excelExport({ 
        fileName: `Holidays_${selectedYear}.xlsx`,
        theme: {
          header: { bold: true, fontColor: '#454545', fontName: 'Calibri', fontSize: 10 },
          record: { fontColor: '#1D1D1D', fontName: 'Calibri', fontSize: 8 }
        }
      });
    }else if (gridRef && args.item.properties.id?.includes('pdfexport')) {
      gridRef.current?.pdfExport({ 
        fileName: `Holidays_${selectedYear}.pdf`,
        theme: {
          header: { bold: true, fontColor: '#454545', fontName: 'Calibri', fontSize: 10 },
          record: { fontColor: '#1D1D1D', fontName: 'Calibri', fontSize: 8 }
        }});
    }
  };

  return (
    <div>
      <Space direction="vertical" size="large">
        <Row justify="space-between" align="middle">
          <Col>
            <Title level={4}>Manage Holidays</Title>
          </Col>
          <Col>
            <Select
              value={selectedYear}
              onChange={handleYearChange}
              options={years.map(year => ({ value: year, label: year.toString() }))}
              style={{ width: 120 }}
            />
            <Button onClick={openAddYearModal} type="primary" style={{ marginLeft: '10px' }} disabled={loading}>
              {loading ? 'Adding ...' : 'Add Year'}
            </Button>
          </Col>
        </Row>

        <GridComponent
          ref={gridRef}
          dataSource={holidays}
          toolbar={toolbarOptions}
          editSettings={editOptions}
          actionBegin={actionBegin}
          allowPaging={true}
          pageSettings={{ pageSize: 10 }}
        allowExcelExport={true}
        allowPdfExport={true}
          toolbarClick={toolbarClick}
        // toolbarClick={openAddDialog}
        >
          <ColumnsDirective>
            <ColumnDirective field="holiday_id" headerText="ID" width="100" textAlign="Right" isPrimaryKey={true} />
            <ColumnDirective field="holiday_name" headerText="Holiday Name" width="200" />
            <ColumnDirective field="holiday_date" headerText="Date" width="200" format="yMd" />
            <ColumnDirective
              headerText="Actions"
              width="150"
              template={(record: any) => (
                <Space size="middle">
                  <a onClick={() => handleRowEdit(record)}>View</a>
                </Space>
              )}
            />
          </ColumnsDirective>
          <Inject services={[Edit, Page, Toolbar, ExcelExport, PdfExport,]} />
        </GridComponent>
      </Space>

      {/* Add Holiday Modal */}
      <Modal
        title="Add Holiday"
        open={dialogVisible}
        onOk={handleSaveHoliday}
        onCancel={() => setDialogVisible(false)}
      >
        <Input
          placeholder="Holiday Name"
          value={holidayName}
          onChange={(e) => setHolidayName(e.target.value)}
          style={{ marginBottom: '10px' }}
        />
        <DatePicker
          disabledDate={disableDatesOutsideSelectedYear}
          placeholder="Select Date"
          value={holidayDate}
          onChange={(date) => setHolidayDate(date)}
          style={{ width: '100%' }}
        />
      </Modal>

      {/* Add Year Modal */}
      <Modal
        title="Add New Year"
        open={yearModalVisible}
        onOk={handleAddYear}
        onCancel={() => setYearModalVisible(false)}
      >
        <Input
          placeholder="Enter year (e.g., 2025)"
          value={newYear}
          onChange={(e) => setNewYear(e.target.value)}
        />
      </Modal>

      {/* Calendar View Modal */}
      <Modal
        title={`Holidays for ${selectedYear}`}
        open={calendarVisible}
        onCancel={() => setCalendarVisible(false)}
        footer={null}
        width="50%"
        height="50%"
      >
        <Calendar
          fullscreen
          value={dayjs(`${selectedYear}-01-01`)}
          dateCellRender={(date) => {
            const formattedDate = date.format('YYYY-MM-DD');
            const holiday = holidays.find((holiday) => holiday.holiday_date === formattedDate);
            return holiday ? <div style={{ color: 'red' }}>{holiday.holiday_name}</div> : null;
          }}
        />
      </Modal>
    </div>
  );
};

export { HolidayCalendarTab };

