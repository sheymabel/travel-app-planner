import { StyleSheet } from 'react-native';
import { Colors } from '../../../constants/Colors'; // Adjust the import path as necessary

export const styles = StyleSheet.create({
        container: {
          flex: 1,
          backgroundColor: '#F1F1F1',
          padding: 20,
        },
        header: {
          fontSize: 28,
          fontWeight: 'bold',
          color: '#333',
          marginBottom: 20,        },
        card: {
          backgroundColor: '#FFFFFF',
          borderRadius: 15,
          overflow: 'hidden',
          marginBottom: 20,
          elevation: 10, // Adds shadow for Android
          shadowColor: '#000', // For iOS shadow
          shadowOffset: { width: 0, height: 10 },
          shadowOpacity: 0.1,
          shadowRadius: 20,
        },
        image: {
          height: 200,
          width: '100%',
          borderBottomLeftRadius: 15,
          borderBottomRightRadius: 15,
        },
        content: {
          padding: 15,
        },
        title: {
          fontSize: 22,
          fontWeight: '600',
          color: '#333',
          marginBottom: 10,
        },
        description: {
          fontSize: 14,
          color: '#777',
          marginBottom: 10,
        },
        price: {
          fontSize: 16,
          color: '#FF5722',
          fontWeight: '600',
        },
        actions: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginTop: 10,
        },
        editButton: {
          backgroundColor: '#6EDD71FF',
          paddingVertical: 10,
          paddingHorizontal: 20,
          borderRadius: 30, // Rounded corners for the button
          alignItems: 'center',
          width: '45%',
          marginRight: 10,
          shadowColor: '#6AC56DFF',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 10,
        },
        deleteButton: {
          backgroundColor: '#F06461FF',
          paddingVertical: 10,
          paddingHorizontal: 20,
          borderRadius: 30, // Rounded corners for the button
          alignItems: 'center',
          width: '45%',
          shadowColor: '#E2504DFF',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 10,
        },
        btnText: {
          color: '#fff',
          fontWeight: '600',
          fontSize: 16,
        },
        addButton: {
          backgroundColor: '#66AEE9FF',
          paddingVertical: 15,
          borderRadius: 30, // Rounded corners for the button
          alignItems: 'center',
          marginBottom: 20,
          shadowColor: '#6CB2EBFF',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 10,
        },
        addText: {
          color: '#fff',
          fontSize: 16,
          fontWeight: '600',
        },


         safeArea: {
            flex: 1,
            backgroundColor: Colors.white,
          },
          scrollContainer: {
            padding: 20,
            paddingBottom: 40,
          },
          title1: {
            fontSize: 24,
            fontWeight: 'bold',
            color: Colors.black,
            marginBottom: 20,
          },
          dropZone: {
            backgroundColor: Colors.gray[100],
            borderRadius: 16,
            paddingVertical: 40,
            paddingHorizontal: 20,
            alignItems: 'center',
            borderWidth: 1,
            borderColor: Colors.gray[200],
            borderStyle: 'dashed',
            marginBottom: 20,
          },
          dropZoneText: {
            marginTop: 15,
            fontSize: 16,
            fontWeight: '600',
            color: Colors.gray[800],
            textAlign: 'center',
          },
          dropZoneSubtext: {
            fontSize: 12,
            color: Colors.gray[500],
            marginTop: 4,
            textAlign: 'center',
          },
          checkboxContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 20,
          },
          checkbox: {
            marginRight: 10,
            width: 20,
            height: 20,
            borderRadius: 4,
            borderWidth: 1.5,
            borderColor: Colors.gray[400],
          },
          checkboxLabel: {
            fontSize: 14,
            color: Colors.gray[600],
          },
          filePreviewContainer: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 30,
          },
          filePreviewBox: {
            width: '22%',
            aspectRatio: 1,
            backgroundColor: Colors.white,
            borderRadius: 12,
            borderWidth: 1.5,
            borderColor: Colors.gray[200],
            alignItems: 'center',
            justifyContent: 'center',
          },
          uploadBox: {
            backgroundColor: Colors.gray[100],
          },
          sectionTitle: {
            fontSize: 18,
            fontWeight: '600',
            color: Colors.black,
            marginBottom: 15,
          },
          inputContainer: {
            backgroundColor: Colors.white,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: Colors.gray[200],
            paddingHorizontal: 15,
            paddingTop: 8,
            paddingBottom: 8,
            marginBottom: 15,
            minHeight: 55,
          },
          inputLabel: {
            fontSize: 12,
            color: Colors.gray[500],
            marginBottom: 4,
          },
          textInput: {
            fontSize: 16,
            color: Colors.black,
            paddingVertical: 4,
          },
          disabledInput: {
            backgroundColor: Colors.gray[100],
            justifyContent: 'center',
          },
          disabledText: {
            fontSize: 16,
            color: Colors.gray[500],
            paddingVertical: 4,
          },
          submitButton: {
            backgroundColor: Colors.primary,
            paddingVertical: 15,
            borderRadius: 12,
            alignItems: 'center',
            marginTop: 20,
            shadowColor: Colors.primary,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.2,
            shadowRadius: 4,
            elevation: 3,
          },
          submitButtonText: {
            fontSize: 16,
            fontWeight: '600',
            color: Colors.white,
          },
      });
      