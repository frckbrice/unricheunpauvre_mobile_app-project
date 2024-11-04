import React from 'react';
import { WebView } from 'react-native-webview';
import { View } from 'react-native';
import { PAYPAL_CLIENT_ID, PAYPAL_SECRET } from '@/constants/constants';

type PaypalButtonProps = {
    amount: number;
    currency: string;
    onSuccess: (data: any) => void;
    onError: (data: any) => void;
}

export const PayPalButton: React.FC<PaypalButtonProps> = ({
    amount,
    currency = 'USD',
    onSuccess,
    onError,
}) => {
    const paypalHTML = `
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <script src="https://www.paypal.com/sdk/js?client-id=${PAYPAL_CLIENT_ID}&currency=${currency}"></script>
      </head>
      <body>
        <div id="paypal-button-container"></div>
        <script>
          paypal.Buttons({
            createOrder: function(data, actions) {
              return actions.order.create({
                purchase_units: [{
                  amount: {
                    value: '${amount}',
                    currency_code: '${currency}'
                  },
                  description: 'Charitable Donation'
                }]
              });
            },
            onApprove: function(data, actions) {
              return actions.order.capture().then(function(details) {
                window.ReactNativeWebView.postMessage(JSON.stringify({
                  type: 'success',
                  details: details
                }));
              });
            },
            onError: function(err) {
              window.ReactNativeWebView.postMessage(JSON.stringify({
                type: 'error',
                error: err
              }));
            }
          }).render('#paypal-button-container');
        </script>
      </body>
    </html>
  `;

    const handleMessage = (event: any) => {
        const data = JSON.parse(event.nativeEvent.data);
        if (data.type === 'success') {
            onSuccess(data.details);
        } else if (data.type === 'error') {
            onError(data.error);
        }
    };

    return (
        <View className="h-64 w-full">
            <WebView
                source={{ html: paypalHTML }}
                onMessage={handleMessage}
                className="flex-1"
            />
        </View>
    );
};
