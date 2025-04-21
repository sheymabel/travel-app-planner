import { Colors } from './../../constants/Colors'
import destinationCategories from './../../data/categories'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import React, { useRef, useState } from 'react'
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'

type Props = {
  onCagtegoryChanged: (category: string) => void
}

const CategoryButtons = ({ onCagtegoryChanged }: Props) => {
  const scrollRef = useRef<ScrollView>(null)
  const itemRef = useRef<any[]>([])
  const [activeIndex, setActiveIndex] = useState(0)

  const handleSelectCategory = (index: number) => {
    const selected = itemRef.current[index]
    setActiveIndex(index)

    selected?.measure((x: number, y: number, width: number, height: number, pageX: number) => {
      scrollRef.current?.scrollTo({ x: pageX, y: 0, animated: true })
    })

    onCagtegoryChanged(destinationCategories[index].title)
  }

  return (
    <View>
      <Text style={styles.title}>Categories</Text>
      <ScrollView
        ref={scrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          gap: 20,
          paddingVertical: 10,
          marginBottom: 10,
        }}
      >
        {destinationCategories.map((item, index) => (
          <TouchableOpacity
            key={index}
            ref={(el) => (itemRef.current[index] = el)}
            onPress={() => handleSelectCategory(index)}
            style={
              activeIndex === index
                ? styles.categoryButtonSelected
                : styles.categoryButton
            }
          >
            <MaterialCommunityIcons
              name={item.iconName as any}
              size={20}
              color={activeIndex === index ? Colors.white : Colors.black}
            />
            <Text
              style={
                activeIndex === index
                  ? styles.categoryBtnTxtActive
                  : styles.categoryBtnTxt
              }
            >
              {item.title}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  )
}

export default CategoryButtons

const styles = StyleSheet.create({
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.black,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    backgroundColor: '#fff',
    boxShadow: '0 1px 2px rgba(51, 51, 51, 0.1)',
  },
  categoryButtonSelected: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    backgroundColor: Colors.primary,
    boxShadow: '0 1px 2px rgba(51, 51, 51, 0.1)',
  },
  categoryBtnTxt: {
    marginLeft: 5,
    color: Colors.black,
  },
  categoryBtnTxtActive: {
    marginLeft: 5,
    color: Colors.white,
  },
})
