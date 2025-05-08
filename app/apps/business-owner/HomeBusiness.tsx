import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import Checkbox from 'expo-checkbox';
import { Colors } from '../../../constants/Colors'; // Adjust the import path as necessary

export default function UploadArtworkScreen() {
  const [isMultiFile, setMultiFile] = useState(false);
  const [itemName, setItemName] = useState('');

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Title */}
        <Text style={styles.title}>Upload Artwork</Text>

        {/* Drop Zone */}
        <TouchableOpacity style={styles.dropZone} activeOpacity={0.7}>
          <Feather name="image" size={32} color={Colors.gray[500]} />
          <Text style={styles.dropZoneText}>Drag and drop or browse a file</Text>
          <Text style={styles.dropZoneSubtext}>PNG, GIF, WEBP, MP4 or MP3. Max 1GB</Text>
        </TouchableOpacity>

        {/* Multi-file Option */}
        <View style={styles.checkboxContainer}>
          <Checkbox
            style={styles.checkbox}
            value={isMultiFile}
            onValueChange={setMultiFile}
            color={isMultiFile ? Colors.primary : undefined}
          />
          <Text style={styles.checkboxLabel}>Multi-file</Text>
        </View>

        {/* File Previews */}
        <View style={styles.filePreviewContainer}>
          {[0, 1, 2, 3].map((_, index) => (
            <View
              key={index}
              style={[styles.filePreviewBox, index === 0 && styles.uploadBox]}
            >
              {index === 0 && <Feather name="upload" size={24} color={Colors.gray[600]} />}
            </View>
          ))}
        </View>

        {/* Information Section */}
        <Text style={styles.sectionTitle}>Information</Text>

        {/* Item Name Input */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            value={itemName}
            onChangeText={setItemName}
            placeholder="Enter item name"
            placeholderTextColor={Colors.gray[400]}
          />
          <Text style={styles.inputLabel}>Item Name</Text>
        </View>

        {/* Tag (Read-Only) */}
        <View style={[styles.inputContainer, styles.disabledInput]}>
          <Text style={styles.inputLabel}>Tag</Text>
          <Text style={styles.disabledText}>Tag</Text>
        </View>

        {/* Description (Read-Only) */}
        <View style={[styles.inputContainer, styles.disabledInput]}>
          <Text style={styles.inputLabel}>Description</Text>
          <Text style={styles.disabledText}>Description</Text>
        </View>

        {/* Submit Button */}
       
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  scrollContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
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
  },
  dropZoneSubtext: {
    fontSize: 12,
    color: Colors.gray[500],
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
    padding: 15,
    marginBottom: 15,
    position: 'relative',
  },
  inputLabel: {
    position: 'absolute',
    top: 8,
    left: 15,
    fontSize: 12,
    color: Colors.gray[500],
    zIndex: 1,
  },
  textInput: {
    fontSize: 16,
    color: Colors.black,
    marginTop: 20,
  },
  disabledInput: {
    backgroundColor: Colors.gray[100],
    justifyContent: 'center',
  },
  disabledText: {
    fontSize: 16,
    color: Colors.gray[500],
    marginTop: 20,
  },
  submitButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.white,
  },
});
