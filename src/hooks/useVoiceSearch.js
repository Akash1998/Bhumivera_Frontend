// Voice search completely removed per request (not needed for 6-product catalog)
export const useVoiceSearch = () => ({
  isListening: false,
  voiceError: null,
  startListening: () => {}
});
export default useVoiceSearch;
