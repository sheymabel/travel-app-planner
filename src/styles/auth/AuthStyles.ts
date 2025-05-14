// AuthStyles.ts
import { StyleSheet, Platform } from 'react-native';
import { Colors } from '../../../constants/Colors';

export const styles = StyleSheet.create({
container: {
flex: 1,
backgroundColor: Colors.white, // Example: Clean white background
},
scrollContent: {
flexGrow: 1,
paddingBottom: 40,
justifyContent: 'center', // Center content vertically for a cleaner look
},
backButton: {
position: 'absolute',
top: Platform.OS === 'ios' ? 60 : 40, // Adjusted top position
left: 20,
padding: 10, // Increased padding for easier touch
zIndex: 10,
backgroundColor: 'rgba(255, 255, 255, 0.7)', // Slight background for visibility
borderRadius: 20,
},
header: {
alignItems: 'center',
paddingTop: Platform.OS === 'ios' ? 120 : 100, // Adjusted padding
paddingBottom: 40, // Increased bottom padding
},
title: {
fontSize: 32, // Larger title
fontWeight: 'bold', // Bolder font
color: Colors.black, // Keep black or use a dark shade
marginBottom: 12,
fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto', // Example font
},
subtitle: {
fontSize: 18, // Slightly larger subtitle
color: Colors.gray[600],
textAlign: 'center',
fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto', // Example font
},
formContainer: {
paddingHorizontal: 30, // Increased horizontal padding
paddingTop: 30,
},
styledInputContainer: {
flexDirection: 'row',
alignItems: 'center',
backgroundColor: Colors.gray[100], // Lighter background for input
borderRadius: 12, // Slightly more rounded corners
marginBottom: 25, // Increased spacing
paddingHorizontal: 20,
height: 60, // Increased height
borderWidth: 1,
borderColor: Colors.gray[300], // Subtle border
},
label: {
fontSize: 15, // Slightly larger label
fontWeight: '600',
color: Colors.gray[800],
marginBottom: 10,
marginLeft: 5,
fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto', // Example font
},
icon: {
marginRight: 12,
},
input: {
flex: 1,
fontSize: 16,
color: Colors.black,
height: '100%',
paddingVertical: 0,
borderWidth: 0,
fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto', // Example font
},
eyeIcon: {
padding: 10, // Increased padding
},
forgotPassword: {
alignSelf: 'flex-end',
marginBottom: 30, // Increased spacing
marginTop: -15, // Adjusted margin
},
forgotPasswordText: {
color: Colors.primary, // Use primary color
fontSize: 15, // Slightly larger
fontWeight: '600',
fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto', // Example font
},
signInButton: {
marginTop: 25,
backgroundColor: Colors.primary, // Vibrant primary color
borderRadius: 12, // Match input border radius
height: 60, // Match input height
justifyContent: 'center',
alignItems: 'center',
width: '100%', // Make button full width
marginBottom: 30,
shadowColor: Colors.primary,
shadowOffset: { width: 0, height: 4 }, // Stronger shadow
shadowOpacity: 0.4,
shadowRadius: 6,
elevation: 8,
},
signInButtonDisabled: {
backgroundColor: Colors.gray[400], // Clear disabled state
elevation: 0,
shadowOpacity: 0,
},
signInButtonText: {
color: Colors.white,
fontSize: 18, // Larger text
fontWeight: 'bold',
fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto', // Example font
},
divider: {
flexDirection: 'row',
alignItems: 'center',
marginVertical: 30, // Increased spacing
},
dividerLine: {
flex: 1,
height: 1,
backgroundColor: Colors.gray[300],
},
dividerText: {
marginHorizontal: 16,
color: Colors.gray[500],
fontSize: 14,
fontWeight: '500',
fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto', // Example font
},
socialButtons: {
flexDirection: 'row',
justifyContent: 'center',
marginBottom: 40, // Increased spacing
},
socialButton: {
width: 60, // Larger button
height: 60,
borderRadius: 30, // Fully rounded
backgroundColor: Colors.white,
justifyContent: 'center',
alignItems: 'center',
marginHorizontal: 15,
borderWidth: 1.5, // Slightly thicker border
borderColor: Colors.gray[400], // Clearer border color
shadowColor: "#A3B3F0FF",
shadowOffset: { width: 0, height: 1 },
shadowOpacity: 0.1,
shadowRadius: 2,
elevation: 3,
},
signUpContainer: {
flexDirection: 'row',
justifyContent: 'center',
paddingVertical: 25, // Increased padding
borderTopWidth: 1, // Add a top border for separation
borderTopColor: Colors.gray[200], // Light border color
marginTop: 20, // Add margin top
},
signUpText: {
color: Colors.gray[600],
fontSize: 15, // Slightly larger
fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto', // Example font
},
signUpLink: {
color: Colors.primary, // Use primary color
fontSize: 15,
fontWeight: 'bold', // Bolder link
marginLeft: 5, // Add space
fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto', // Example font
},
});

export default styles; 