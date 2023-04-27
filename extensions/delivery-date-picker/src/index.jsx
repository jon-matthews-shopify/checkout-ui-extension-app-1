import React from 'react';
import {
  useExtensionApi,
  render,
  Banner,
  useTranslate,
  BlockStack,
  Text
} from '@shopify/checkout-ui-extensions-react';

import DatePicker from './components/DatePicker.jsx';

render('Checkout::Dynamic::Render', () => <App />);

function App() {
  const {extensionPoint} = useExtensionApi();
  const translate = useTranslate();
  return (
    <BlockStack>
      <DatePicker />
    </BlockStack>
  );
}
