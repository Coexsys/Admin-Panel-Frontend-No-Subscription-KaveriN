import { Flex, Space, Table, Button, Modal, Form, List, Tabs, InputNumber, Spin, Checkbox, Avatar, Card, message } from "antd";
import type { TabsProps } from 'antd';
import styles from "./styles.module.css";
import { Row, Col, Typography } from 'antd';

import {
  IconExternalLink,
  IconFileExcel,
  IconRefresh,
  IconHelp,
} from "@tabler/icons-react";


import React, { useEffect, useState, useRef, useMemo } from 'react';
import axios from 'axios';
import { Padding } from "@syncfusion/ej2-react-documenteditor";
const token = localStorage.getItem('bearerToken') || '';

console.log(token)
interface LicenseData {
  total_licenses: number;
  plan_name: string;
  plan_code: string;
  licenses_available: number;
  licenses_used: number;
  subscription_id: string;
  licenses_to_remove: number;

}
// Define the structure of the license response
interface LicenseResponse {
  total_licenses: number;
  licenses_available: number;
  licenses_used: number;
  plan_data: {
    years: LicenseData; // Extracting years as PlanData
    months: LicenseData;
  };
}

interface Subscription {
  plan_name: string;
  interval_unit: string;
  next_billing_at: string;
  amount: number;
  plan_code: string;
}

interface LicenseMap {
  [key: string]: LicenseData;
}
interface ZohoPlan {
  key: string;
  name: string;
  plan_code: string;
  image: string;
  price: number;
  interval_unit: string;
  licenseQty: number;
  total: number;
  licenses_available: number;
  licenses_used: number;
  total_licenses: number;
}
interface PlansResponse {
  plans: ZohoPlan[];
}

// Define a new interface that includes the subscription IDs
interface OrganizedPlan extends ZohoPlan {
  subscriptionId?: string; // Optional number since some plans might not have a subscription
}

const DashboardTab: React.FC = () => {
  const hasFetchedData = useRef(false); // useRef persists across re-renders
  const [licenses, setLicenses] = useState<LicenseData[]>([]);
  const [subscriptions, setSubscriptions] = useState<LicenseData[]>([]);
  const [totalLicenses, setTotalLicenses] = useState(0);
  const [licensesAvailable, setLicensesAvailable] = useState(0);
  const [licensesUsed, setLicensesUsed] = useState(0);
  const [plans, setPlans] = useState<ZohoPlan[]>([]);
  const [cardType, setCardType] = useState<string>('');
  const [paylicenses, setPayLicenses] = useState<LicenseMap>({});
  const [planCode, setPlanCode] = useState<string>('');
  const [planQnt, setPlanQnt] = useState<any>();
  const [subscriptionId, setSubscriptionId] = useState<string>('');
  const [planBillingData, setplanBillingData] = useState<any>(null);
  const [nextPaymentDetails, setNextPaymentDetails] = useState([]);



  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [removeModalVisible, setIsRemoveModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [monthlyPlans, setMonthlyPlans] = useState<OrganizedPlan[]>([]);
  const [yearlyPlans, setYearlyPlans] = useState<OrganizedPlan[]>([]);

  const [monthlyLicensePlans, setMonthlyLicensePlans] = useState<LicenseData[]>([]);
  const [yearlyLicensePlans, setYearlyLicensePlans] = useState<LicenseData[]>([]);
  const [licensedPlan, setLicensedPlan] = useState<LicenseData[]>([]);

  const baseURL = `${process.env.REACT_APP_BACKEND_URL || ""}api/`;

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await fetch(baseURL + 'licenses', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      const result = await response.json(); // Assuming the API returns JSON data
      const licenseData = result;
      if (licenseData.plan_data.years) {
        setYearlyLicensePlans(licenseData.plan_data.years)
      }

      // Add the monthly plan if it exists
      if (licenseData.plan_data.months) {
        setMonthlyLicensePlans(licenseData.plan_data.months)
      }
      const combinedArray = [...licenseData.plan_data.months, ...licenseData.plan_data.years];

      setLicensedPlan(combinedArray);
      setLicenses(licenseData);
      setTotalLicenses(licenseData.total_licenses);
      setLicensesAvailable(licenseData.licenses_available);
      setLicensesUsed(licenseData.licenses_used);

    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setTimeout(() => {
        // Simulating response from backend
        setLoading(false);
      }, 3000); // Simulate 3 seconds delay
    }
  };
  const fetchNextPaymentDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch(baseURL + 'get-next-payment-details', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      const result = await response.json(); // Assuming the API returns JSON data
      const paymentData = result.subscriptions;
      const nextPaymentDetails = result.next_payment_details
      setNextPaymentDetails(nextPaymentDetails);
      const plansLicenseArray: LicenseData[] = [];
      if (paymentData.code === 0) {
        if (result.licenses.years) {
          plansLicenseArray.push(result.licenses.years);
        }
        // Add the monthly plan if it exists
        if (result.licenses.months) {
          plansLicenseArray.push(result.licenses.months);
        }
        setSubscriptions(plansLicenseArray);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setTimeout(() => {
        // Simulating response from backend
        setLoading(false);
      }, 3000); // Simulate 3 seconds delay
    }
  };
  // Fetch plans from Laravel backend
  const fetchPlans = async () => {
    try {
      setLoading(true);
      const response = await axios.get(baseURL + 'plans');
      const response_plans = response.data || [];
      if (Array.isArray(response_plans)) {

        // Add quantity and totalAmount fields to each plan
        const updatedPlans: ZohoPlan[] = response_plans.map((plan, index) => ({
          key: index.toString(),
          name: plan.name,
          plan_code: plan.plan_code,
          image: plan.image,
          price: plan.recurring_price,
          interval_unit: plan.interval_unit,
          licenseQty: 0, // Default initial quantity is 1
          total: plan.recurring_price, // Initial totalAmount is price * quantity
          licenses_available: 0,
          licenses_used: 0,
          total_licenses: 0
        }));
        setPlans(updatedPlans);
      } else {
        console.error("Invalid response format: plans is not an array");
      }

    } catch (error) {
      console.error('Error fetching plans:', error);
    } finally {
      setTimeout(() => {
        // Simulating response from backend
        setLoading(false);
      }, 3000); // Simulate 3 seconds delay
    }
  };

  useEffect(() => {
    // setLoading(true)
    if (!hasFetchedData.current) {
      fetchData();
      fetchNextPaymentDetails();
      fetchPlans();
      hasFetchedData.current = true;
    }
  }, [loading]);
  useEffect(() => {
    console.log(licensedPlan);
  }, [licensedPlan])
  useEffect(() => {
    console.log(monthlyLicensePlans);
  }, [monthlyLicensePlans])
  useEffect(() => {
    console.log(yearlyLicensePlans);
  }, [yearlyLicensePlans])
  useEffect(() => {
  }, [subscriptions])
  useEffect(() => {
  }, [nextPaymentDetails])
  useEffect(() => {
  }, [plans])

  const organizeSubscriptionsByPlanCode = (
    allPlans: ZohoPlan[],
    subscriptionPlans: LicenseData[]
  ): OrganizedPlan[] => {
    // Create an object to hold the organized data
    const organizedSubscriptions: { [key: string]: OrganizedPlan } = {};
    allPlans.forEach(plan => {
      organizedSubscriptions[plan.plan_code] = {
        ...plan,
        subscriptionId: undefined, // Initialize with undefined
      };
    });

    // Loop through subscription plans and push the subscription IDs to their corresponding plan codes
    subscriptionPlans.forEach(subscription => {
      const { plan_code, subscription_id, licenses_available, total_licenses, licenses_used } = subscription;
      if (organizedSubscriptions[plan_code]) {
        organizedSubscriptions[plan_code].subscriptionId = subscription_id;
        organizedSubscriptions[plan_code].licenses_available = licenses_available;
        organizedSubscriptions[plan_code].total_licenses = total_licenses;
        organizedSubscriptions[plan_code].licenses_used = licenses_used;

      }
    });
    return Object.values(organizedSubscriptions);
  };
  const organizedData = useMemo(() => {

    return organizeSubscriptionsByPlanCode(plans, subscriptions);
  }, [plans, subscriptions]); // Only recompute when allPlans or subscriptionPlans change
  useEffect(() => {
    const organizedData = organizeSubscriptionsByPlanCode(plans, subscriptions);
    const month_plans = organizedData.filter((plan) => plan.interval_unit === 'months');
    const year_plans = organizedData.filter((plan) => plan.interval_unit === 'years');
    // console.log(organizedData)
    setMonthlyPlans(month_plans);
    setYearlyPlans(year_plans);
  }, [plans, subscriptions]);

  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);

  // Function to remove the last license row
  const openRemoveLicense = () => {
      // Reset all licenses to 0 when opening modal
      const resetLicensedPlan = licensedPlan.map(record => ({
        ...record,
        licenses_to_remove: 0
      }));
      setLicensedPlan(resetLicensedPlan);
      setHasSelectedLicenses(false);
      setSelectedPlanId(null);
    setIsRemoveModalVisible(true);
  };

  // Function to show modal
  const showModal = () => {
    setIsModalVisible(true);
  };

  // Function to hide modal
  const handleCancel = () => {
    setIsModalVisible(false);
    setIsRemoveModalVisible(false);
    form.resetFields();
    setSelectedPlanId(null);
    setHasSelectedLicenses(false);
  };
  const [activeTab, setActiveTab] = useState<string>("1"); // "1" for monthly, "2" for yearly

  // Helper function to validate and get selected plan details
  const getSelectedPlanDetails = (): { planCode: string; quantity: number } | null => {
    // Get relevant plans based on active tab
    const relevantPlans = activeTab === "1" ? monthlyPlans : yearlyPlans;

    // Find plan with non-zero quantity
    const selectedPlan = relevantPlans.find(plan => plan.licenseQty > 0);

    if (selectedPlan) {
      return {
        planCode: selectedPlan.plan_code,
        quantity: selectedPlan.licenseQty
      };
    }

    return null;
  };

  // Handle the license quantity change
  const handleLicenseQtyChange = (value: number, record: ZohoPlan) => {
    const updatedPlans = plans.map(plan => {
      if (plan.key === record.key) {
        setPlanCode(plan.plan_code)
        const updatedTotal = plan.price * value;
        setPlanQnt(value);
        return { ...plan, licenseQty: value, total: updatedTotal };
      }
      return plan;
    });
    setPlans(updatedPlans);
  };
  const [hasSelectedLicenses, setHasSelectedLicenses] = useState(false);
  

  const handleLicenseChange = (value: number | null, recordKey: string, maxAvailable: number) => {
      // Handle null value from InputNumber
    const numericValue = value === null ? 0 : value;
    
    // If trying to select a different plan when one is already selected
    if (selectedPlanId && selectedPlanId !== recordKey && numericValue > 0) {
      message.error('You can only remove licenses from one plan at a time');
      return;
    }

    // Ensure value is within bounds
    const validatedValue = Math.min(Math.max(0, numericValue), maxAvailable);

    const updatedDataSource = licensedPlan.map((record) => {
      if (record.subscription_id === recordKey) {
        if (validatedValue > 0) {
          setSelectedPlanId(recordKey);
          setPlanCode(record.plan_code);
          setPlanQnt(validatedValue);
          setSubscriptionId(record.subscription_id);
        } else if (validatedValue === 0 && selectedPlanId === recordKey) {
          setSelectedPlanId(null);
        }
        
        return { 
          ...record, 
          licenses_to_remove: validatedValue 
        };
      }
      return record;
    });
    
    const hasLicenses = updatedDataSource.some(record => record.licenses_to_remove > 0);
    setHasSelectedLicenses(hasLicenses);
    
    setLicensedPlan(updatedDataSource);
    // // Handle null value from InputNumber
    // const numericValue = value === null ? 0 : value;
    // // If trying to select a different plan when one is already selected
    //   if (selectedPlanId && selectedPlanId !== recordKey && value > 0) {
    //     message.error('You can only remove licenses from one plan at a time');
    //     return;
    //   }
    // // Update the dataSource with the new value
    // const updatedDataSource = licensedPlan.map((record) => {
    //   if (record.subscription_id === recordKey) {
    //     // Ensure value doesn't exceed available licenses
    //     const validatedValue = Math.min(value, record.licenses_available);
        
    //     if (validatedValue > 0) {
    //       setSelectedPlanId(recordKey);
    //       setPlanCode(record.plan_code);
    //       setPlanQnt(validatedValue);
    //       setSubscriptionId(record.subscription_id);
    //     } else if (value === 0 && selectedPlanId === recordKey) {
    //       setSelectedPlanId(null);
    //     }
        
    //     return { ...record, licenses_available: validatedValue };
    //   }
    //   return record;
    // });

    // // const updatedDataSource = licensedPlan.map((record) => {
    // //   if (record.subscription_id === recordKey) {
    // //     setPlanCode(record.plan_code)
    // //     setPlanQnt(value);
    // //     setSubscriptionId(record.subscription_id)
    // //     return { ...record, licenses_available: value };
    // //   }
    // //   return record;
    // // });
    //  // Check if any licenses have been selected for removal
    //  const hasLicenses = updatedDataSource.some(record => record.licenses_available > 0);
    //  setHasSelectedLicenses(hasLicenses);
     
    //  setLicensedPlan(updatedDataSource);
  };
  const proceedSubscription = async () => {
    try {
      // First validate form (for terms acceptance)
      await form.validateFields();

      // Get selected plan details
      const selectedPlan = getSelectedPlanDetails();

      if (!selectedPlan) {
        message.error("Please select a plan and set license quantity greater than 0");
        return;
      }

      const formDataToSend = new FormData();
      formDataToSend.append('planCode', selectedPlan.planCode);
      formDataToSend.append('planQnt', selectedPlan.quantity.toString());

      setLoading(true);

      const response = await fetch(baseURL + 'buy_new_licenses', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formDataToSend,
      });

      if (response.ok) {
        message.success('Licenses purchased successfully');
        handleCancel();
        await fetchData();  // Refresh data
      } else {
        message.error('Failed to purchase licenses');
      }

    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        message.error(error.response.data.message || 'Purchase failed');
      } else {
        message.error('An error occurred during purchase');
      }
    } finally {
      setLoading(false);
    }


    // const formDataToSend = new FormData();
    // formDataToSend.append('planCode', planCode);
    // formDataToSend.append('planQnt', planQnt);
    // if (planQnt == 0 ) {
    //   message.error("Please set license quantity");
    //   return;
    // }
    // setLoading(true)

    // try {
    //   await form.validateFields();
    //   const response = await fetch(baseURL + 'buy_new_licenses', {
    //     method: 'POST',
    //     headers: {
    //       // 'Content-Type':'multipart/form-data',
    //       'Authorization': `Bearer ${token}`,
    //     }, body: formDataToSend,
    //   });
    //   if (response.ok) {
    //     message.success('User subscribed to selected plan successfully');
    //     handleCancel();
    //     const newData = await fetchData();  // Re-fetch all data after update
    //   } else {
    //     message.error('Unable to create subscriptions');
    //     console.error('Failed to save the data.');
    //   }
    //   console.log('User subscribed to selected plan successfully', response.ok);
    //   // let subscribe_id = response.su;
    //   // navigate(`auth/signup-confirmation/${subscribe_id}`);
    // } catch (error) {
    //   // Handle error response from backend (e.g., wrong credentials)
    //   if (axios.isAxiosError(error) && error.response) {
    //     // setError(error.response.data.message || 'Reset failed');
    //   } else {
    //     // setError('An error occurred during login');
    //   }
    // } finally {
    //   setTimeout(() => {
    //     // Simulating response from backend
    //     setLoading(false);
    //   }, 3000); // Simulate 3 seconds delay
    // }

  };
  const removeLicense = async () => {
    try {
      // Validate that exactly one plan has licenses selected for removal
      const selectedPlans = licensedPlan.filter(record => record.licenses_to_remove > 0);
      
      if (selectedPlans.length === 0) {
        message.error('Please select licenses to remove');
        return;
      }
      
      if (selectedPlans.length > 1) {
        message.error('You can only remove licenses from one plan at a time');
        return;
      }

      // Validate form (for terms acceptance)
      await form.validateFields();

      const formDataToSend = new FormData();
      formDataToSend.append('plan_code', planCode);
      formDataToSend.append('qty', planQnt.toString());
      formDataToSend.append('subscription_id', subscriptionId);
      
      setLoading(true);

      const response = await fetch(baseURL + 'remove_licenses', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formDataToSend,
      });

      if (response.ok) {
        message.success('Licenses removed successfully');
        handleCancel();
        await fetchData();  // Refresh data
      } else {
        const errorData = await response.json();
        message.error(errorData.message || 'Failed to remove licenses');
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        message.error(error.response.data.message || 'License removal failed');
      } else {
        message.error('An error occurred during license removal');
      }
    } finally {
      setLoading(false);
    }
  };

  // const removeLicense = async () => {
  //   try {
  //     // Validate that at least one license is selected for removal
  //     if (!hasSelectedLicenses) {
  //       message.error('Please select at least one license to remove');
  //       return;
  //     }

  //     // Validate form (for terms acceptance)
  //     await form.validateFields();

  //     const formDataToSend = new FormData();
  //     formDataToSend.append('plan_code', planCode);
  //     formDataToSend.append('qty', planQnt);
  //     formDataToSend.append('subscription_id', subscriptionId);
      
  //     setLoading(true);

  //     const response = await fetch(baseURL + 'remove_licenses', {
  //       method: 'POST',
  //       headers: {
  //         'Authorization': `Bearer ${token}`,
  //       },
  //       body: formDataToSend,
  //     });

  //     if (response.ok) {
  //       message.success('Licenses removed successfully');
  //       handleCancel();
  //       await fetchData();  // Refresh data
  //     } else {
  //       const errorData = await response.json();
  //       message.error(errorData.message || 'Failed to remove licenses');
  //     }
  //   } catch (error) {
  //     if (axios.isAxiosError(error) && error.response) {
  //       message.error(error.response.data.message || 'License removal failed');
  //     } else {
  //       message.error('An error occurred during license removal');
  //     }
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // const removeLicense = async () => {

  //   const formDataToSend = new FormData();
  //   formDataToSend.append('plan_code', planCode);
  //   formDataToSend.append('qty', planQnt);
  //   formDataToSend.append('subscription_id', subscriptionId);
  //   setLoading(true);
  //   try {
  //     await form.validateFields();
  //     const response = await fetch(baseURL + 'remove_licenses', {
  //       method: 'POST',
  //       headers: {
  //         // 'Content-Type':'multipart/form-data',
  //         'Authorization': `Bearer ${token}`,
  //       }, body: formDataToSend,
  //     });
  //     if (response.ok) {
  //       const newData = await fetchData();  // Re-fetch all data after update
  //     } else {
  //       console.error('Failed to save the data.');
  //     }
  //     console.log('User subscribed to selected plan successfully', response.ok);
  //     // let subscribe_id = response.su;
  //     // navigate(`auth/signup-confirmation/${subscribe_id}`);
  //   } catch (error) {
  //     // Handle error response from backend (e.g., wrong credentials)
  //     if (axios.isAxiosError(error) && error.response) {
  //       // setError(error.response.data.message || 'Reset failed');
  //     } else {
  //       // setError('An error occurred during login');
  //     }
  //   } finally {
  //     setTimeout(() => {
  //       // Simulating response from backend
  //       setLoading(false);
  //     }, 3000); // Simulate 3 seconds delay
  //   }

  // };
  // Calculate the grand total for each tab
  const calculateGrandTotal = (filteredPlans: ZohoPlan[]) =>
    filteredPlans.reduce((acc, plan) => acc + plan.total, 0);

  const columns = [
    {
      title: 'Zoho Plan',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Price (per license)',
      dataIndex: 'price',
      key: 'price',
      render: (price: number) => `$${price.toFixed(2)}`,
    },
    {
      title: 'License Quantity',
      dataIndex: 'licenseQty',
      key: 'licenseQty',
      render: (licenseQty: number, record: ZohoPlan) => (
        <InputNumber
          min={0}
          max={100}
          value={licenseQty}
          onChange={(value) => handleLicenseQtyChange(value as number, record)}
        />
      ),
    },
    {
      title: 'Total',
      dataIndex: 'total',
      key: 'total',
      render: (total: number) => `$${total.toFixed(2)}`,
    },



  ]
  // Define the columns for the table
  const remove_license_columns = [

    {
      title: 'Subscription ID',
      dataIndex: 'subscription_id',
      key: 'subscription_id',
    },
    {
      title: 'Plan Name',
      dataIndex: 'plan_name',
      key: 'plan_name',
    },
    {
      title: 'Plan Code',
      dataIndex: 'plan_code',
      key: 'plan_code',
    },
    {
      title: 'Total Licenses',
      dataIndex: 'total_licenses',
      key: 'total_licenses',
    },
    {
      title: 'Licenses to Remove',
      dataIndex: 'licenses_to_remove',
      key: 'licenses_to_remove',
      render: (_:any, record:any) => (
        <InputNumber
          min={0}
          max={record.licenses_available}
          value={record.licenses_to_remove || 0}
          onChange={(value) => handleLicenseChange(value, record.subscription_id, record.licenses_available)}
          keyboard={true}
          controls={true}
          precision={0}
          style={{ width: '100px' }}
        />
      ),
    },

    // {
    //   title: 'Remove Available License',
    //   dataIndex: 'licenses_available',
    //   key: 'licenses_available',
    //   render: (_:any, record:any) => (
    //     <InputNumber
    //     min={0}
    //     max={record.licenses_available}
    //     value={record.licenses_to_remove || 0}
    //     onChange={(value) => handleLicenseChange(value, record.subscription_id, record.licenses_available)}
    //     keyboard={true}
    //     controls={true}
    //     precision={0}
    //     style={{ width: '100px' }}
    //   />

    //     // <InputNumber
    //     //   min={0}
    //     //   max={record.licenses_available}
    //     //   value={record.licenses_available}
    //     //   onChange={(value) => handleLicenseChange(value || 0, record.subscription_id)}
    //     // />
    //   ),

    //   // render: (text: number, record: any) => (
    //   //   <InputNumber
    //   //     min={0}
    //   //     max={record.total_licenses} // Ensure it can't exceed the total licenses
    //   //     value={text}
    //   //     onChange={(value) => handleLicenseChange(value as number, record.subscription_id)}
    //   //   />
    //   // ),
    // },
    {
      title: 'Licenses Used',
      dataIndex: 'licenses_used',
      key: 'licenses_used',
    },
  ];
  const handleListClick = async (subscription_id: string) => {
    if (typeof subscription_id !== "undefined") {
      const formDataToSend = new FormData();
      formDataToSend.append('subscription_id', subscription_id);
      try {
        setLoading(true);
        const response = await fetch(baseURL + 'get_subscription_plan_detials', {
          method: 'POST',
          headers: {
            // 'Content-Type':'multipart/form-data',
            'Authorization': `Bearer ${token}`,
          }, body: formDataToSend,
        });
        if (response.ok) {
          const result = await response.json();
          setplanBillingData(result);
        } else {
          console.error('Failed to save the data.');
        }

      } catch (error) {
        console.error('Error fetching plans:', error);
      } finally {
        setTimeout(() => {
          // Simulating response from backend
          setLoading(false);
        }, 3000); // Simulate 3 seconds delay
      }

    }

  };
  // Tabs configuration for Monthly and Yearly plans
  const tabItems: TabsProps['items'] = [
    {
      key: '1',
      label: 'Monthly Plans',
      children: (
        <Table
          columns={columns}
          dataSource={monthlyPlans}
          pagination={false}
          summary={() => (
            <Table.Summary.Row>
              <Table.Summary.Cell index={0} colSpan={3}>
                <strong>Grand Total</strong>
              </Table.Summary.Cell>
              <Table.Summary.Cell index={3}>
                <strong>${calculateGrandTotal(monthlyPlans).toFixed(2)}</strong>
              </Table.Summary.Cell>
            </Table.Summary.Row>
          )}
        />

        // <Table columns={columns} dataSource={monthlyPlans} pagination={false} summary={() => (
        //   <Table.Summary.Row>
        //     <Table.Summary.Cell index={0} colSpan={3}>
        //       <strong>Grand Total</strong>
        //     </Table.Summary.Cell>
        //     <Table.Summary.Cell index={3}>
        //       <strong>${calculateGrandTotal(monthlyPlans).toFixed(2)}</strong>
        //     </Table.Summary.Cell>
        //   </Table.Summary.Row>
        // )}
        // />
      ),
    },
    {
      key: '2',
      label: 'Yearly Plans',
      children: (
        <Table
          columns={columns}
          dataSource={yearlyPlans}
          pagination={false}
          summary={() => (
            <Table.Summary.Row>
              <Table.Summary.Cell index={0} colSpan={3}>
                <strong>Grand Total</strong>
              </Table.Summary.Cell>
              <Table.Summary.Cell index={3}>
                <strong>${calculateGrandTotal(yearlyPlans).toFixed(2)}</strong>
              </Table.Summary.Cell>
            </Table.Summary.Row>
          )}
        />

        // <Table columns={columns} dataSource={yearlyPlans} pagination={false} summary={() => (
        //   <Table.Summary.Row>
        //     <Table.Summary.Cell index={0} colSpan={3}>
        //       <strong>Grand Total</strong>
        //     </Table.Summary.Cell>
        //     <Table.Summary.Cell index={3}>
        //       <strong>${calculateGrandTotal(yearlyPlans).toFixed(2)}</strong>
        //     </Table.Summary.Cell>
        //   </Table.Summary.Row>
        // )} />
      ),
    },
  ];
  const items: TabsProps['items'] = [
    {
      key: '1',
      label: 'Monthly',
      children: (<List
        itemLayout="horizontal"
        dataSource={monthlyLicensePlans}
        renderItem={(plan) => (
          <List.Item
            onClick={() => plan.subscription_id && handleListClick(plan.subscription_id)}
            style={{ cursor: plan.subscription_id ? 'pointer' : 'default' }}
          >
            <List.Item.Meta
              avatar={<Avatar src="" />}
              title={
                plan.subscription_id ? (
                  <a style={{ color: '#1890ff' }}>{plan.plan_name}</a> // Link color styling
                ) : (
                  plan.plan_name
                )
              }
              description={
                plan.subscription_id ? (
                  <a style={{ color: '#1890ff' }}>
                    Total Licenses: {plan.total_licenses}, Available Licenses: {plan.licenses_available}
                  </a>
                ) : (
                  `Total Licenses: ${plan.total_licenses}, Available Licenses: ${plan.licenses_available}`
                )
              }
            />
          </List.Item>
        )}
      />
      ),
    },
    {
      key: '2',
      label: 'Yearly',
      children: (<List
        itemLayout="horizontal"
        dataSource={yearlyLicensePlans}
        renderItem={(plan) => (
          <List.Item
            onClick={() => plan.subscription_id && handleListClick(plan.subscription_id)}
            style={{ cursor: plan.subscription_id ? 'pointer' : 'default' }}
          >
            <List.Item.Meta
              avatar={<Avatar src="" />}
              title={
                plan.subscription_id ? (
                  <a style={{ color: '#1890ff' }}>{plan.plan_name}</a> // Link color styling
                ) : (
                  plan.plan_name
                )
              }
              description={
                plan.subscription_id ? (
                  <a style={{ color: '#1890ff' }}>
                    Total Licenses: {plan.total_licenses}, Available Licenses: {plan.licenses_available}
                  </a>
                ) : (
                  `Total Licenses: ${plan.total_licenses}, Available Licenses: ${plan.licenses_available}`
                )
              }
            />
          </List.Item>
        )}
      // renderItem={(plan) => (
      //   <List.Item onClick={() => handleListClick(plan.subscriptionId)} style={{ cursor: 'pointer' }}>
      //     <List.Item.Meta
      //       avatar={<Avatar src={plan.image} />}
      //       title={plan.name}
      //       description={`Total Licenses: 0, Available Licenses:0`}
      //     />
      //   </List.Item>
      // )}
      />),
    },
  ];

  const onChange = (key: string) => {
  };

  const { Title } = Typography;
  const subscriptionColumns = [
    { title: 'Plan', dataIndex: 'plan_name', key: 'plan_name' },
    { title: 'Plan Type', dataIndex: 'plan_type', key: 'plan_type' },
    { title: 'Payment Date', dataIndex: 'next_billing_at', key: 'next_billing_at' },
    { title: 'Total License', dataIndex: 'total_licenses', key: 'total_licenses' },
    { title: 'Amount', dataIndex: 'amount', key: 'amount' },
    { title: 'Payment Method', dataIndex: 'payment_method', key: 'payment_method' },

  ];
  const nextBillingDate = planBillingData && planBillingData.next_billing_date ? planBillingData.next_billing_date : "";
  const amount = planBillingData && planBillingData.amount ? planBillingData.amount : "";
  const billcardType = planBillingData && planBillingData.card_type ? planBillingData.card_type : "";
  const billcardNumber = planBillingData && planBillingData.card_number ? planBillingData.card_number : "";
  const billcardExpiesAt = planBillingData && planBillingData.card_expiry_date ? planBillingData.card_expiry_date : "";


  const billingColumns = [
    { title: 'Plan', dataIndex: 'field', key: 'field' },
    { title: 'Value', dataIndex: 'value', key: 'value' },
  ];

  const billingData = [
    { key: '1', field: 'Next Billing Date', value: nextBillingDate },
    { key: '2', field: 'Renew Until Cancelled', value: '-' },
    { key: '3', field: 'Amount', value: amount },
  ];

  const cardColumns = [
    { title: 'Field', dataIndex: 'field', key: 'field' },
    { title: 'Value', dataIndex: 'value', key: 'value' },
  ];

  const cardData = [
    { key: '1', field: 'Type', value: billcardType },
    { key: '2', field: 'Card Number', value: billcardNumber },
    { key: '3', field: 'Card Expiry Date', value: billcardExpiesAt },
  ];
  let planDetails = planBillingData && planBillingData.planDetails ? planBillingData.planDetails : {};
  // Transform the object into an array for Ant Design table
  const planDetailsdataSource = Object.keys(planDetails).map((key, index) => ({
    key: index,
    name: key,
    value: planDetails[key],
  }));
  // Function to show confirmation modal
  const showConfirm = () => {
    Modal.confirm({
      title: 'Are you sure you want to update your subscription?',
      okText: 'Yes',
      cancelText: 'No',
      onOk: updateSubscription,
    });
  };

  const updateSubscription = async () => {
    try {
      const response = await fetch(baseURL + 'subscription/update', {
        method: 'POST',
        headers: {
          // 'Content-Type':'multipart/form-data',
          'Authorization': `Bearer ${token}`,
        },
      });
      if (response.ok) {
        message.success("Subscription updated successfully!");
      } else {
        message.error("Failed to update subscription.");
      }
    } catch (error) {
      message.error("An error occurred while updating the subscription.");
    }
  };

  const planColumns = [
    { title: 'Field', dataIndex: 'name', key: 'name' },
    { title: 'Value', dataIndex: 'value', key: 'value' },
  ];

  const purchaseHistoryColumns = [
    {
      title: 'Transaction ID',
      dataIndex: 'transaction_id',
      key: 'transaction_id',
    },
    {
      title: 'Reference ID',
      dataIndex: 'reference_id',
      key: 'reference_id',
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
    },
    {
      title: 'Amount ($)',
      dataIndex: 'amount',
      key: 'amount',
    },
  ];
  const purchaseHistory = planBillingData && planBillingData.purchaseHistory ? planBillingData.purchaseHistory : [];



  return (
    <div className={styles.container}>
      <Spin spinning={loading} tip="Loading...">
        <Space direction="vertical" size="large" className={styles.main}>
          <Space direction="vertical" size="small" className={styles.main + ' ' + styles.spaceItem}>
            <Row justify="space-between" align="middle">
              <Col>
                <Title level={4}>License Usage </Title>
              </Col>
              <Col>
                <Button type="primary" onClick={showModal}>
                  Buy New License
                </Button>
                <Button
                  type="default"
                  onClick={openRemoveLicense}
                  style={{ marginLeft: '10px' }}
                >
                  Remove License
                </Button>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={8} className={styles["row-gap"]}>
                <Card>
                  <p className={styles["card-title"]}>{totalLicenses}</p>
                  <p className={styles["card-description"]}>
                    Total License Inventory
                  </p>
                </Card>
              </Col>
              <Col span={8} className={styles["row-gap"]}>
                <Card>
                  <p className={styles["card-title"]}>{licensesAvailable}</p>
                  <p className={styles["card-description"]}>
                    Licenses currently assigned
                  </p>
                </Card>
              </Col>
              <Col span={8} className={styles["row-gap"]}>
                <Card>
                  <p className={styles["card-title"]}>{licensesUsed}</p>
                  <p className={styles["card-description"]}>Available Licenses</p>
                </Card>
              </Col>
            </Row>
          </Space>
          <Space direction="vertical" size="small" className={styles.main + ' ' + styles.spaceItem}>
            <Tabs defaultActiveKey="1" items={items} onChange={onChange} />
          </Space>
          <Row style={{ paddingLeft: '20px' }} className={styles.main + ' ' + styles.spaceItem}>
            <Col span={24}>
              <Title level={4}>Plan Selected: {planDetails.Name} </Title>
              <Title level={5}>Billing Details</Title>
            </Col>
            <Col span={8} style={{ paddingRight: '15px' }}>
              <Table
                columns={planColumns}
                dataSource={planDetailsdataSource}
                pagination={false}
                bordered
                size="small"
              />
            </Col>
            <Col span={8} style={{ paddingRight: '15px' }}>
              <Table
                columns={billingColumns}
                dataSource={billingData}
                pagination={false}
                bordered
                size="small"
              />
            </Col>
            <Col span={8}>
              <Table
                columns={cardColumns}
                dataSource={cardData}
                pagination={false}
                bordered
                size="small"
              />
            </Col>
          </Row>
          <Space direction="vertical" size="small" className={styles.main + ' ' + styles.spaceItem}>
            <Row style={{ paddingLeft: '20px' }} >
              <Col span={24}>
                <Title level={4}>Payment History</Title>
                <Title level={5}>Your Next Payments</Title>
                {/* <Button type="primary" onClick={showConfirm}>
            Update Subscription
        </Button> */}
              </Col>
            </Row>
            <Row className="mt-5">
              <Col span={24}>
                <Table
                  columns={subscriptionColumns}
                  dataSource={nextPaymentDetails}
                  pagination={false}
                  bordered
                  size="small"
                />
              </Col>
            </Row>
          </Space>
          <Row style={{ paddingLeft: '20px' }} className={styles.main + ' ' + styles.spaceItem}>
            <Col span={24}>
              <div className="d-flex justify-content-between">
                <Title level={5}>License Purchase History</Title>
                {/* <a href="javascript:void(0);" className="btn btn-sm btn-primary">
              View All
            </a> */}
              </div>
              <Table
                loading={loading}
                columns={purchaseHistoryColumns}
                dataSource={purchaseHistory}
                rowKey="transaction_id"
                pagination={false}
                bordered
                size="small"
              />
            </Col>
          </Row>


          {/* Modal for buying new licenses */}
          <Modal
            title="Buy New License"
            open={isModalVisible}
            onCancel={handleCancel}
            // onOk={proceedSubscription}  // Trigger handleOk on confirm
            footer={[
              <Button key="cancel" onClick={handleCancel}>
                Cancel
              </Button>,
              <Button key="submit" type="primary" onClick={proceedSubscription} disabled={loading}>
                {loading ? 'Buying...' : 'Buy'}
              </Button>,
            ]}
            width={600}  // Set the modal width to better display the plans
          >
            <Space direction="vertical" size="small" className={styles.main}>

              <Form form={form} layout="vertical">
                <Tabs defaultActiveKey="1" items={tabItems} onChange={(key) => setActiveTab(key)} />
                <Form.Item
                  name="acceptTerms"
                  valuePropName="checked" // Indicates that this is a checkbox
                  rules={[{ required: true, message: 'You must accept the terms and conditions!' }]}
                >
                  <Checkbox id="terms" required > <label htmlFor="terms">I agree to the <a href="/">Terms of Use</a></label></Checkbox>
                </Form.Item>

              </Form>
            </Space>


          </Modal>
          {/* Modal for removing licenses */}
          <Modal
            title="Remove License"
            open={removeModalVisible}
            onCancel={handleCancel}
            onOk={proceedSubscription}  // Trigger handleOk on confirm
            footer={[
              <Button key="cancel" onClick={handleCancel}>
                Cancel
              </Button>,
              // <Button key="submit" type="primary" onClick={removeLicense}>
              //   Remove
              // </Button>,
              <Button 
              key="submit" 
              type="primary" 
              onClick={removeLicense}
              disabled={!hasSelectedLicenses || loading}
            >
              {loading ? 'Removing...' : 'Remove'}
            </Button>,
            ]}
            width={800} // Adjust modal width
            style={{overflowY: 'hidden' }}
          >
            <Space direction="vertical" size="small" className={styles.main}>
              <Form form={form} layout="vertical">
                <Table
                  dataSource={licensedPlan}
                  columns={remove_license_columns} scroll={{ y: 300 }}
                  rowKey="subscription_id" // Unique key for each row
                />
                <Form.Item
                  name="acceptTerms"
                  valuePropName="checked" // Indicates that this is a checkbox
                  rules={[{ required: true, message: 'You must accept the terms and conditions!' }]}
                >
                  <Checkbox id="terms" required > <label htmlFor="terms">I agree to the <a href="/">Terms of Use</a></label></Checkbox>
                </Form.Item>
                {/* <Flex justify="end">
                <button onClick={removeLicense} className={styles.submitbutton} disabled={loading}>{loading ? 'Processing...' : 'Process Subscription'}</button>
              </Flex> */}
              </Form>
            </Space>

          </Modal>
        </Space>
      </Spin>
    </div >
  );

}

export { DashboardTab };