import React, { useEffect, useState } from 'react';
import axios from 'axios';
const baseURL = `${process.env.REACT_APP_BACKEND_URL || ""}api/`;
const path= `${process.env.REACT_APP_WINDOW_URL || ""}`;


const Zoho: React.FC = () => {
    const [plans, setPlans] = useState<any[]>([]);
    const [isModalOpen, setModalOpen] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState<any>(null); // Adjust type as needed
    let isScriptLoaded = false;

    // Load Zoho widget script dynamically
    const loadZohoWidgetScript = () => {
        // Check if script is already loaded
        if (isScriptLoaded) {
            console.log('Zoho Widget Script already loaded.');
            return;
        }
        const scriptId = 'zf-widget-script';
        const existingScript = document.getElementById(scriptId);
        if (!existingScript) {

            const script = document.createElement('script');
            script.src = 'https://js.zohostatic.com/books/zfwidgets/assets/js/zf-widget.js';
            script.async = true;
            script.id = scriptId;
            script.onload = () => {
                console.log('Zoho widget script loaded');
                fetchPlans(); // Only fetch plans after the widget script has loaded
                isScriptLoaded = true; // Mark as loaded

            };
            script.onerror = () => {
                console.error('Error loading Zoho Widget Script');
            };
            document.body.appendChild(script);
        } else {
            console.log('Script already exists in DOM');
        }
    };
    const attachCustomClickHandlers = () => {
        const subscribeButtons = document.querySelectorAll('div#zf-widget-root-id'); // Replace with the actual class for the buttons
        console.log(subscribeButtons);
        subscribeButtons.forEach((button) => {
            button.addEventListener('click', () => {
                const planCode = button.getAttribute('data-plan-code'); // Assuming plan code is stored in a data attribute
                setSelectedPlan(planCode);
                setModalOpen(true); // Open the modal
            });
        });
    };

    const closeModal = () => {
        setModalOpen(false);
        setSelectedPlan(null);
    };


    // Fetch plans from Laravel backend
    const fetchPlans = async () => {
        try {
            const response = await axios.get(baseURL+'plans');
            const plans = response.data || [];
            setPlans(plans);
            initializeZohoWidget(plans); // Call only if not initialized
            // await initializeZohoWidget(plans); // Initialize Zoho widget with plans
        } catch (error) {
            console.error('Error fetching plans:', error);
        }
    };
    const initializeZohoWidget = (plans: any[]) => {
        if (!window.ZFWidget) {
            console.error('Zoho widget script not loaded');
            return;
        }
        let ZohoPlans = Array.isArray(plans) ? plans.map(plan => ({
            plan_code: plan.plan_code,
            url: plan.url,
            recurring_price: plan.recurring_price,
            recurring_price_formatted: plan.recurring_price_formatted,
            button_action_type: 'link',
            button_action_value: path+`/auth/signup?planCode=${plan.plan_code}&planPrice=${plan.recurring_price}`,
            strike_amount: ''
        })) : []; // Handle the case where plans is undefined or not an array  

        const pricingTableComponentOptions = {
            id: 'zf-widget-root-id',
            product_id: '2-0350adbb0ff585fef3b7add3f8a199eddde9d5bb80218974d3d8d34806d97caae5c4a916a477b97358bcad6fd428a6fd9c3091c7b9ab014f5eb36ff696767231', // Replace with actual product_id
            template: 'modern',
            most_popular_plan: '',
            is_group_by_frequency: true,
            isFrequencyDropdown: false,
            isCurrencyDropdown: true,
            can_show_plan_freq: true,
            can_show_previous_plans_included: false,
            split_amount_by_month: false,
            //   is_group_by_frequency:true,
            //   isFrequencyDropdown: true,
            plans: ZohoPlans,
            pricebooks: [
                {
                    pricebook_id: '5530556000000011001', // Replace with actual pricebook_id
                    currency_code: 'USD',
                    currency_symbol: '$',
                    plans: ZohoPlans,
                },
            ],
            group_options: [
                {
                    frequency: 'Monthly',
                    frequency_recurrence_value: '1_months',
                    most_popular_plan: '',
                    plans: Array.isArray(plans) ? plans.filter(plan => plan.interval_unit == 'months') : []
                },
                {
                    frequency: 'Yearly',
                    frequency_recurrence_value: '1_years',
                    most_popular_plan: '',
                    plans: Array.isArray(plans) ? plans.filter(plan => plan.interval_unit == 'years') : []
                }
            ],
            theme: { color: '#f4ca71', theme_color_light: '' },
            button_text: '14 Days trial',
            product_url: 'https://billing.zoho.com',
            price_caption: '',
            language_code: 'en',
            open_inSameTab: false,
            defaultFrequencyValue: '1_months',
            higlight_text: 'Most Popular',
            defaultCurrency: ''

        };
        // Log the data being passed to the widget
        console.log('Pricing Table Options:', pricingTableComponentOptions);


        // Call Zoho widget init method
        window.ZFWidget.init('zf-pricing-table', pricingTableComponentOptions);

    };


    useEffect(() => {
        loadZohoWidgetScript();
        // Attach event handlers after widget has initialized
        setTimeout(() => {
            attachCustomClickHandlers();
        }, 1000); // Adjust the delay if necessary


    }, []);

    return <div id="zf-widget-root-id"></div>;
};

export default Zoho;