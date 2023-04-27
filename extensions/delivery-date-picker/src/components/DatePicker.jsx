import { React, useState, useEffect } from 'react';
import {
  Select,
  InlineStack,
  View,
  useApplyMetafieldsChange,
  useMetafield
} from '@shopify/checkout-ui-extensions-react';

const getDaysInMonth = (monthIndex) => {
  const currentDate = new Date();
  const daysInMonth = [];
  const date = new Date(currentDate.getFullYear(), monthIndex, 1);

  while (date.getMonth() == monthIndex) {
    daysInMonth.push(new Date(date));
    date.setDate(date.getDate() + 1);
  }

  return daysInMonth;
}

function DatePicker(props) {

  const [selectedMonth, setSelectedMonth] = useState(0);
  const [selectedDay, setSelectedDay] = useState(0);
  const [daysOfMonth, setDaysOfMonth] = useState([]);

  const applyMetafieldsChange = useApplyMetafieldsChange();

  // Define the metafield namespace and key
  const metafieldNamespace = "custom";
  const metafieldKey = "desired_delivery_date";

  const getDateAsString = () => {

    const options = { month: 'long' };
    const monthName = new Date(0, selectedMonth).toLocaleString('en-US', options);

    return `${monthName} ${selectedDay}`;
  }

  const initMonth = () => {
    if (0 == selectedMonth){
      console.log('initialising months...');
      const date = new Date();
      const currentMonthIndex = date.getMonth();
      setSelectedMonth(currentMonthIndex);
    }
  }

  const refreshMonthDays = () => {

    if (0 == selectedMonth){
      console.log('No month set, cannot refresh days');
      return;
    }

    console.log('Refresing days...');

    const monthDays = getDaysInMonth(selectedMonth);

    const days = [];

    for (let i = 0; i < monthDays.length; i++) {
      const day = monthDays[i];
      days.push({
        value: day.getDate(),
        label: day.getDate()
      })
    }

    setDaysOfMonth(days);
  }

  const saveMetafieldValue = async () => {

    const dateString = getDateAsString();

    console.log(`Saving metafield value: ${dateString}`);

    const res = await applyMetafieldsChange({
      type: "updateMetafield",
      namespace: metafieldNamespace,
      key: metafieldKey,
      valueType: "string",
      value: dateString,
    });

    console.log(res);
  }

  useEffect(() => {

    console.log('ON LOAD');
    initMonth();

  }, []);

  useEffect(() => {

    console.log('ON MONTH CHANGE');
    refreshMonthDays();
    setSelectedDay(1);
    saveMetafieldValue();

  }, [selectedMonth]);

  useEffect(() => {

    console.log('ON DAY CHANGE');

    saveMetafieldValue();

  }, [selectedDay]);


  // Get a reference to the metafield
  const deliveryDateMetafield = useMetafield({
    namespace: metafieldNamespace,
    key: metafieldKey,
  });

  const date = new Date();

  // Month
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const currentMonthIndex = date.getMonth();
  const nextMonthIndex = date.getMonth() + 1;

  const months = [
    {
      value: currentMonthIndex,
      label: monthNames[currentMonthIndex]
    },
    {
      value: nextMonthIndex,
      label: monthNames[nextMonthIndex]
    }];

  return (
    <InlineStack spacing="base">
      <View border="base" padding="base">
        <Select
          label="Month"
          id="delivery_date_month"
          value={selectedMonth}
          options={months}
          onChange={setSelectedMonth}
          required={true}
        />
      </View>
      <View border="base" padding="base">
        <Select
          label="Day"
          value={selectedDay}
          options={daysOfMonth}
          onChange={setSelectedDay}
          required={true}
        />
      </View>
    </InlineStack>
  );
}

export default DatePicker;
