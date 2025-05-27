import { StyleSheet, Dimensions } from 'react-native';
import { Colors } from '../../../constants/Colors';

const { width } = Dimensions.get('window');
const CARD_MARGIN = 8;
const CARD_WIDTH = (width - 48) / 2; // 2 columns with margins

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  
  // Header styles (clean and transparent)
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingTop: 8,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 15,
  },
  
  backButton: {
    padding: 8,
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderRadius: 20,
  },

  // Carousel styles with proper image handling
  carouselContainer: {
    height: 350,
    position: 'relative',
  },
  carouselImage: {
    
    width: width,
    height: 350,
    resizeMode: 'cover',
  },
  indicatorContainer: {
        marginTop:40,

    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 5,
    backgroundColor: 'rgba(255,255,255,0.5)',
    marginHorizontal: 4,
  },
  activeIndicator: {
    backgroundColor: Colors.white,
    width: 12,
    
  },

  // Info container styles
  infoContainer: {
       

    padding: 20,
    paddingTop: 5,
    backgroundColor: Colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: -10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: Colors.gray[900],
  },
  detailsRow: {
    
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    flexWrap: 'wrap',
    gap: 10,
  },
  detailContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.gray[100],
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 20,
  },
  detailLabel: {
    fontSize: 14,
    color: Colors.gray[600],
    marginRight: 6,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.gray[800],
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    color: Colors.gray[800],
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: Colors.gray[700],
  },
  errorText: {
    fontSize: 16,
    color: Colors.error,
    textAlign: 'center',
    padding: 20,
  },

  // Card styles (optional)
  card: {
    width: CARD_WIDTH,
    margin: CARD_MARGIN,
    backgroundColor: Colors.white,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: Colors.gray[500],
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardImage: {
    width: '100%',
    height: 120,
    resizeMode: 'cover',
  },
  cardContent: {
    padding: 12,
  },
});