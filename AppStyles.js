import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  scrollContainer: {
    paddingBottom: 100,
    minHeight: '100%',
    backgroundColor: '#E8EBED',
  },
  container: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 39,
    color: '#74B7D1',
    marginBottom: 5,
    textAlign: 'center',
    fontFamily: 'CabinSketch-Bold',
  },
  instructions: {
    fontSize: 11.5,
    color: '#555',
    textAlign: 'center',
    marginBottom: 15,
    lineHeight: 22,
  },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  input: {
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  msg: {
    textAlign: 'center',
    fontSize: 16,
    color: '#444',
    marginBottom: 10,
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  scoreText: {
    fontSize: 16,
    fontWeight: '500',
    marginRight: 4,
  },
  scoreValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#74B7D1',
  },
  scoreTotal: {
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 4,
  },
  timerText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#444',
    marginBottom: 10,
  },
  bestScore: {
    textAlign: 'center',
    fontSize: 16,
    color: '#74B7D1',
    fontWeight: '600',
    marginBottom: 12,
  },
  guessTitle: {
    fontSize: 18,
    fontWeight: '500',
    marginTop: 20,
    marginBottom: 8,
    color: '#333',
  },
  guessItem: {
    backgroundColor: '#fff',
    padding: 12,
    marginVertical: 4,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  guessText: {
    fontSize: 16,
    color: '#333',
  },
});

export default styles;
