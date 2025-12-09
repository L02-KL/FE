import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import AboutScreen from '../../doctor/AboutScreen';
import { Colors } from '../../../constants/colors';

// Mock the dependencies
jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: () => ({
    goBack: jest.fn(),
  }),
}));

jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  }),
}));

jest.mock('@expo/vector-icons', () => ({
  Ionicons: 'Ionicons',
}));

jest.mock('../../../../assets/logo.png', () => 'test-logo-path');

jest.mock('../../../components/BottomNavigationBar', () => 'BottomNavigationBar');

describe('AboutScreen', () => {
  const renderScreen = () => {
    return render(
      <NavigationContainer>
        <AboutScreen />
      </NavigationContainer>
    );
  };

  it('renders without crashing', () => {
    renderScreen();
    expect(screen.getByText('About')).toBeTruthy();
  });

  it('displays the correct header title', () => {
    renderScreen();
    expect(screen.getByText('About')).toBeTruthy();
  });

  it('renders the back button', () => {
    renderScreen();
    const backButton = screen.getByTestId('back-button');
    expect(backButton).toBeTruthy();
  });

  it('renders the app logo and name', () => {
    renderScreen();
    // Use getAllByText since there are multiple "BKMindCare" texts
    const appNameElements = screen.getAllByText('BKMindCare');
    expect(appNameElements.length).toBeGreaterThan(0);
    expect(screen.getByText('Version 1.0.0')).toBeTruthy();
  });

  it('displays the about section content', () => {
    renderScreen();
    // Use getByTestId since we added testID="about-title"
    expect(screen.getByTestId('about-title')).toBeTruthy();
    expect(screen.getByText(/BKMindCare is a comprehensive mental health support platform/)).toBeTruthy();
  });

  it('lists all platform features', () => {
    renderScreen();
    expect(screen.getByText('Platform Features')).toBeTruthy();
    expect(screen.getByText('Patient Management & Statistics')).toBeTruthy();
    expect(screen.getByText('Appointment Scheduling & Management')).toBeTruthy();
    expect(screen.getByText('Anonymous Chat Support')).toBeTruthy();
    expect(screen.getByText('Patient Emotional Trends Analysis')).toBeTruthy();
    expect(screen.getByText('Review & Rating System')).toBeTruthy();
  });

  it('displays contact information', () => {
    renderScreen();
    expect(screen.getByText('Contact Us')).toBeTruthy();
    expect(screen.getByText('support@bkmindcare.edu.vn')).toBeTruthy();
    expect(screen.getByText('+84 123 456 789')).toBeTruthy();
    expect(screen.getByText('HCMUT Campus, Ho Chi Minh City')).toBeTruthy();
  });

  it('shows copyright information', () => {
    renderScreen();
    expect(screen.getByText('© 2024 BKMindCare. All rights reserved.')).toBeTruthy();
  });

  it('navigates back when back button is pressed', () => {
    const mockGoBack = jest.fn();
    jest.spyOn(require('@react-navigation/native'), 'useNavigation')
      .mockReturnValue({ goBack: mockGoBack });

    renderScreen();
    const backButton = screen.getByTestId('back-button');
    
    fireEvent.press(backButton);
    expect(mockGoBack).toHaveBeenCalled();
  });
});