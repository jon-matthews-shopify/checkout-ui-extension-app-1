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

  const [selectedDay, setSelectedDay] = useState(0);
  const [selectedMonth, setSelectedMonth] = useState(0);
  const [daysOfMonth, setDaysOfMonth] = useState([]);

  const applyMetafieldsChange = useApplyMetafieldsChange();

  // Define the metafield namespace and key
  const metafieldNamespace = "custom";
  const metafieldKey = "desired_delivery_date";

  const getDateAsString = (monthIndex, dayIndex) => {

    const options = { month: 'long' };
    const monthName = new Date(0, monthIndex).toLocaleString('en-US', options);

    return `${monthName} ${dayIndex}`;
  }

  const initMonth = () => {
    console.log('initialising months...');
    const date = new Date();
    const currentMonthIndex = date.getMonth();
    refreshMonthDays(currentMonthIndex);
  }

  const refreshMonthDays = (monthIndex) => {

    if (0 == monthIndex){
      console.log('No month set, cannot refresh days');
      return;
    }

    console.log('Refresing days...');

    const monthDays = getDaysInMonth(monthIndex);

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

  const handleMonthChange = (monthIndex) => {
    console.log(`month input changed ${monthIndex}`);
    setSelectedMonth(monthIndex);
    refreshMonthDays(monthIndex);
    setSelectedDay(1);
    saveMetafieldValue(monthIndex, 1);
  }

  const handleDayChange = (dayIndex) => {
    console.log(`day input changed ${dayIndex}`);
    setSelectedDay(dayIndex);
    saveMetafieldValue(selectedMonth, dayIndex);
  }

  const saveMetafieldValue = async (monthIndex, dayIndex) => {

    const dateString = getDateAsString(monthIndex, dayIndex);

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
          value={selectedMonth}
          options={months}
          onChange={(value)=>{handleMonthChange(value)}}
          required={true}
        />
      </View>
      <View border="base" padding="base">
        <Select
          label="Day"
          value={selectedDay}
          options={daysOfMonth}
          onChange={(value)=>{handleDayChange(value)}}
          required={true}
        />
      </View>
    </InlineStack>
  );
}

export default DatePicker;
