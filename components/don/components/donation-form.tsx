import React, { useState } from 'react';
import { View, Text, TextInput, Alert, TouchableOpacity } from 'react-native';
import { PayPalButton } from './paypal-button';
import { DonationResponse } from '@/lib/types';

export const DonationForm: React.FC = () => {
  const [amount, setAmount] = useState('');
  const [showPayPal, setShowPayPal] = useState(false);

  const handleDonationSuccess = (details: DonationResponse) => {
    Alert.alert(
      'Thank You!',
      `Your donation of ${details.amount.value} ${details.amount.currency_code} has been processed successfully!`,
      [{
        text: 'OK', onPress: () => {
          setAmount('');
          setShowPayPal(false);
        }
      }]
    );
    // Here you would typically save the donation details to your backend
  };

  const handleDonationError = (error: any) => {
    Alert.alert('Error', 'There was an error processing your donation. Please try again.');
    setShowPayPal(false);
  };

  const handleAmountSubmit = () => {
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      Alert.alert('Invalid Amount', 'Please enter a valid donation amount.');
      return;
    }
    setShowPayPal(true);
  };

  return (
    <View className="p-4">
      <Text className="text-xl font-bold mb-4">Make a Donation</Text>
      {!showPayPal ? (
        <View>
          <TextInput
            className="border border-gray-300 rounded-lg p-3 mb-4"
            placeholder="Enter donation amount"
            keyboardType="decimal-pad"
            value={amount}
            onChangeText={setAmount}
          />
          <TouchableOpacity
            className="bg-blue-500 rounded-lg p-4"
            onPress={handleAmountSubmit}
          >
            <Text className="text-white text-center font-semibold">
              Proceed to Donate
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View>
          <Text className="text-lg mb-4">
            Donation Amount: ${amount}
          </Text>
          <PayPalButton
            amount={Number(amount)}
            onSuccess={handleDonationSuccess}
            onError={handleDonationError}
            currency={'€'}
          />
          <TouchableOpacity
            className="mt-4 p-2"
            onPress={() => setShowPayPal(false)}
          >
            <Text className="text-blue-500 text-center">
              Cancel
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};