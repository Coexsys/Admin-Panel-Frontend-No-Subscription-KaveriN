import React, { useEffect, useState, useRef } from 'react';
import { Row, Col, Table, Checkbox, Image, Modal, Spin, Button, Switch  } from 'antd';
import axios from 'axios';

interface Subscription {
    plan_name: string;
    plan_code: string;
    last_update_date: string;
}

interface PlanUsageState {
    [key: string]: {
        plan_name: string;
        plan_code: string;
        total_licenses: number;
        licenses_available: number;
        licenses_used: number;
    };
}

interface User {
    full_name: string;
    user_status: string;
    user_email: string;
    creation_date: string;
    last_plan_update_date: string;
    image_name: string;
    user_id: number;
}

interface UserProfileProps {
    visible: boolean;
    userId: number;
    onClose: () => void;
}

const UserSubscriptionDetails: React.FC<UserProfileProps> = ({ visible, userId, onClose }) => {

    const [user, setUser] = useState<User | null>(null);
    const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
    const [planUsageState, setPlanUsageState] = useState<PlanUsageState>({});
    const [currentPlanNameArr, setCurrentPlanNameArr] = useState<string[]>([]);
    const token = localStorage.getItem('bearerToken') || '';
    const baseURL = `${process.env.REACT_APP_BACKEND_URL || ""}api/`;
    const imageBaseURL = `${process.env.REACT_APP_BACKEND_URL || ""}storage/`;


    const [loading, setLoading] = useState(true);

    const fetchUserData = async () => {
        setLoading(true);
        // Fetch user details, subscriptions, and plan usage state
        axios.get(baseURL+`get_user_subscription_data/${userId}`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        }) // Example API call
            .then(res => {
                // const { user, subscriptions, planUsageState, currentPlanNameArr } = res.data;
                setUser(res.data.user);
                if (res.data.subscriptions) {
                    setSubscriptions(res.data.subscriptions);
                }
                if (res.data.planUsageState) {
                    setPlanUsageState(res.data.planUsageState);
                }
                if (res.data.currentPlanNameArr) {
                    setCurrentPlanNameArr(res.data.currentPlanNameArr);
                }
            })
            .catch(err => {
                console.error(err)
                const user = err.response.data.error;
                console.log(user);
            });
    };

    useEffect(() => {
        if (userId) {
            fetchUserData();
        }
    }, [userId]);
    // Reset modal state when closed
    useEffect(() => {
        if (!visible) {
            setUser(null); // Clear user details
            setSubscriptions([]);
            setPlanUsageState({});
            setCurrentPlanNameArr([]);
            setLoading(true);     // Reset loading state
        }
    }, [visible]);

    const handleOk = async () => {
        setLoading(true);
        const formDataToSend = new FormData();
        const planNameArray = currentPlanNameArr;

    formDataToSend.append('userId', userId.toString());
    formDataToSend.append("currentPlanNames", JSON.stringify(currentPlanNameArr));  
    try {
        const response = await fetch(baseURL+'set_user_subscription_data', {
          method: 'POST',
          headers: {
            // 'Content-Type':'multipart/form-data',
            'Authorization': `Bearer ${token}`,
          }, body: formDataToSend,
        });

        if (response.ok) {
        //   const newData = await fetchData();  // Re-fetch all data after update
        } else {
          console.error('Failed to save the data.');
        }
      } catch (error) {
        console.error('Error while saving the data:', error);
      }
    }

    const columnsCurrentSubscription = [
        { title: 'Plan Name', dataIndex: 'plan_name', key: 'plan_name' },
        { title: 'Plan Code', dataIndex: 'plan_code', key: 'plan_code' },
        { title: 'Subscribed Date', dataIndex: 'last_update_date', key: 'last_update_date', render: (date: string) => new Date(date).toLocaleDateString() },
        {
            title: 'Actions',
            key: 'actions',
            render: (text: string, record: Subscription) => (
                <Switch checked={true} />
                // <Checkbox defaultChecked />
            ),
        },
    ];

    const handleSwitchChange = (checked: boolean, record: any) => {
        console.log('Switch checked:', checked);
          const plansArray: string[] = [];
          const currentPlan = record.plan_name + " ## " + record.plan_code
            plansArray.push(currentPlan);
            // plansArray.push(record.plan_code);
            setCurrentPlanNameArr(plansArray);
      };
      useEffect(() => {
        console.log(currentPlanNameArr)
    }, [currentPlanNameArr]);
    

    const columnsAvailablePlans = [
        { title: 'Plan Name', dataIndex: 'plan_name', key: 'plan_name' },
        { title: 'Plan Code', dataIndex: 'plan_code', key: 'plan_code' },
        { title: 'Licenses Available', dataIndex: 'licenses_available', key: 'licenses_available' },
        { title: 'Licenses Used', dataIndex: 'licenses_used', key: 'licenses_used' },
        {
            title: 'Actions',
            key: 'actions',
            render: (text: string, record: any) => (
                record.licenses_available > 0 && <Switch onChange={(checked) => handleSwitchChange(checked, record)}
 />
            ),
        },
    ];

    const availablePlansData = Object.keys(planUsageState)
        .map(plan => {
            return {
                plan_name: planUsageState[plan].plan_name,
                plan_code: planUsageState[plan].plan_code,
                total_licenses: planUsageState[plan].total_licenses,
                licenses_available: planUsageState[plan].licenses_available,
                licenses_used: planUsageState[plan].licenses_used,
            };
        })
        // .filter(plan => !currentPlanNameArr.includes(plan.plan_name));

    if (!user) {
        return <div></div>;
    }
    // Conditionally set the dataSource to current_subscriptions if it exists, otherwise use an empty array
    const current_subscriptions = subscriptions && subscriptions.length > 0
        ? subscriptions
        : [];
    // Conditionally set the dataSource to current_subscriptions if it exists, otherwise use an empty array
    const current_availablePlansData = availablePlansData && availablePlansData.length > 0
        ? availablePlansData
        : [];



    return (
        <Modal
            open={visible}
            title="User Details"
            onCancel={onClose}
            onOk={onClose}
            footer={[
                <Button key="cancel" onClick={onClose}>
                  Cancel
                </Button>,
                <Button key="submit" type="primary" onClick={handleOk}>
                  Confirm
                </Button>,
              ]}
            width={800} // Customize the width if needed
        >
            <div className="container">
                <Row gutter={16} className="mt-2">
                    <Col span={4}>
                        <Image
                            width={120}
                            src={user.image_name && user.image_name ? imageBaseURL + user.image_name : '../../../../../images/default_face.png'}
                        />
                    </Col>
                    <Col span={20}>
                        <h4>{user.full_name} <small>({user.user_status})</small></h4>
                        <p>{user.user_email}</p>
                        <p>Created Date: {new Date(user.creation_date).toLocaleDateString()}</p>
                        <p>Plan Last Updated Date: {new Date(user.last_plan_update_date).toLocaleDateString()}</p>
                    </Col>
                </Row>

                <Row className="mt-3">
                    <Col span={24}>
                        <h5>Current Subscription</h5>
                        <Table columns={columnsCurrentSubscription} dataSource={current_subscriptions} rowKey="plan_name" />
                    </Col>
                </Row>

                <Row className="mt-4">
                    <Col span={24}>
                        <h4>Additional Available Plans</h4>
                        <Table columns={columnsAvailablePlans} dataSource={current_availablePlansData} rowKey="plan_name" />
                    </Col>
                </Row>

                <input type="hidden" id="h_user_id" name="h_user_id" value={user.user_id} />
            </div>
        </Modal>

    );
};

export default UserSubscriptionDetails;
