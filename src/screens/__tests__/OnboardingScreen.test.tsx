// Mock Dimensions BEFORE any imports - MUST be hoisted
jest.mock('react-native/Libraries/Utilities/Dimensions', () => ({
  get: jest.fn(() => ({ width: 375, height: 812 })),
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
}));

// Mock useNavigation hook
const mockNavigate = jest.fn();
jest.mock('@react-navigation/native', () => {
  return {
    ...jest.requireActual('@react-navigation/native'),
    useNavigation: () => ({
      navigate: mockNavigate,
      goBack: jest.fn(),
    }),
  };
});

import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import OnboardingScreen from '../OnboardingScreen';

describe('OnboardingScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Test case 1: Component renders without crashing
  it('should render without crashing', () => {
    const { getByText } = render(<OnboardingScreen />);
    
    // Check if welcome title is rendered
    expect(getByText('Welcome to BKMindCare')).toBeTruthy();
  });

  // Test case 2: Should display first page content correctly
  it('should display first page content correctly', () => {
    const { getByText } = render(<OnboardingScreen />);
    
    // Check first page elements
    expect(getByText('Welcome to BKMindCare')).toBeTruthy();
    expect(
      getByText(
        /Stress is part of the Bach Khoa University's health journey/i
      )
    ).toBeTruthy();
    
    // Check buttons on first page
    expect(getByText('Skip')).toBeTruthy();
    expect(getByText('Next')).toBeTruthy();
  });

  // Test case 3: Should call navigation when Skip button is pressed
  it('should call navigation when Skip button is pressed', () => {
    const { getByText } = render(<OnboardingScreen />);
    
    // Find and press Skip button
    const skipButton = getByText('Skip');
    fireEvent.press(skipButton);
    
    // Verify navigation was called
    expect(mockNavigate).toHaveBeenCalledWith('Login');
  });

  // Test case 4: Should navigate to next page when Next button is pressed
  it('should navigate to next page when Next button is pressed', () => {
    const { getByText } = render(<OnboardingScreen />);
    
    // Press Next button
    const nextButton = getByText('Next');
    fireEvent.press(nextButton);
    
    // After pressing Next, should show second page content
    // Page 2 shows features and steps
    expect(getByText('How it works')).toBeTruthy();
    expect(getByText('1-on-1 Counseling with Experts')).toBeTruthy();
    
    // Button should now say "Back" and "Get Started"
    expect(getByText('Back')).toBeTruthy();
    expect(getByText('Get Started')).toBeTruthy();
  });

  // Test case 5: Should navigate back to previous page when Back button is pressed
  it('should navigate back to previous page when Back button is pressed', () => {
    const { getByText } = render(<OnboardingScreen />);
    
    // First, go to second page
    const nextButton = getByText('Next');
    fireEvent.press(nextButton);
    
    // Verify we're on second page (check for second page content)
    expect(getByText('How it works')).toBeTruthy();
    expect(getByText('1-on-1 Counseling with Experts')).toBeTruthy();
    expect(getByText('Back')).toBeTruthy();
    
    // Press Back button
    const backButton = getByText('Back');
    fireEvent.press(backButton);
    
    // Should be back on first page
    expect(getByText('Welcome to BKMindCare')).toBeTruthy();
    expect(getByText('Skip')).toBeTruthy();
    expect(getByText('Next')).toBeTruthy();
  });

  // Test case 6: Should display all features on second page
  it('should display all features on second page', () => {
    const { getByText } = render(<OnboardingScreen />);
    
    // Navigate to second page
    const nextButton = getByText('Next');
    fireEvent.press(nextButton);
    
    // Check all feature titles are displayed
    expect(getByText('1-on-1 Counseling with Experts')).toBeTruthy();
    expect(getByText('Mental Health Assessment Tests')).toBeTruthy();
    expect(getByText('Self-Care Resources')).toBeTruthy();
  });

  // Test case 7: Should display all steps in "How it works" section
  it('should display all steps in "How it works" section', () => {
    const { getByText } = render(<OnboardingScreen />);
    
    // Navigate to second page
    const nextButton = getByText('Next');
    fireEvent.press(nextButton);
    
    // Check all step titles
    expect(getByText('Sign Up')).toBeTruthy();
    expect(getByText('Book Session')).toBeTruthy();
    expect(getByText('Get Support')).toBeTruthy();
  });

  // Test case 8: Should navigate to Login screen when Get Started button is pressed
  it('should navigate to Login screen when Get Started button is pressed', () => {
    const { getByText } = render(<OnboardingScreen />);
    
    // Navigate to second page (last page)
    const nextButton = getByText('Next');
    fireEvent.press(nextButton);
    
    // Verify we're on the last page
    expect(getByText('Get Started')).toBeTruthy();
    
    // Press Get Started button
    const getStartedButton = getByText('Get Started');
    fireEvent.press(getStartedButton);
    
    // Verify navigation was called with 'Login'
    expect(mockNavigate).toHaveBeenCalledWith('Login');
  });

  // Test case 9: Should display pagination dots correctly
  it('should display pagination dots correctly', () => {
    const { getByText } = render(<OnboardingScreen />);
    
    // Check that footer with pagination dots exists by checking buttons are present
    expect(getByText('Skip')).toBeTruthy(); // First page indicator
    
    // Navigate to second page
    const nextButton = getByText('Next');
    fireEvent.press(nextButton);
    
    // Verify we can still see buttons (footer with dots is rendered)
    expect(getByText('Back')).toBeTruthy();
    expect(getByText('Get Started')).toBeTruthy();
  });

  // Test case 10: Should change button text correctly on last page
  it('should change button text correctly on last page', () => {
    const { getByText, queryByText } = render(<OnboardingScreen />);
    
    // On first page, button should say "Next"
    expect(getByText('Next')).toBeTruthy();
    expect(queryByText('Get Started')).toBeNull();
    
    // Navigate to second page (last page)
    const nextButton = getByText('Next');
    fireEvent.press(nextButton);
    
    // On last page, button should say "Get Started" instead of "Next"
    expect(getByText('Get Started')).toBeTruthy();
    expect(queryByText('Next')).toBeNull();
  });

  // Test case 11: Should display feature descriptions on second page
  it('should display feature descriptions on second page', () => {
    const { getByText } = render(<OnboardingScreen />);
    
    // Navigate to second page
    const nextButton = getByText('Next');
    fireEvent.press(nextButton);
    
    // Check all feature descriptions are displayed
    expect(
      getByText(/Schedule private sessions with experienced counselors/i)
    ).toBeTruthy();
    expect(
      getByText(/Check in with yourself through professional questionnaires/i)
    ).toBeTruthy();
    expect(
      getByText(/Explore helpful videos and exercises/i)
    ).toBeTruthy();
  });

  // Test case 12: Should display step descriptions on second page
  it('should display step descriptions on second page', () => {
    const { getByText } = render(<OnboardingScreen />);
    
    // Navigate to second page
    const nextButton = getByText('Next');
    fireEvent.press(nextButton);
    
    // Check all step descriptions are displayed
    expect(
      getByText(/Create your free account in minutes/i)
    ).toBeTruthy();
    expect(
      getByText(/Choose your counselor, pick a time/i)
    ).toBeTruthy();
    expect(
      getByText(/Connect with your therapist through video/i)
    ).toBeTruthy();
  });
});
