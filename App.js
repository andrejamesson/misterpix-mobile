import React, { useState, useRef } from 'react';
import { StyleSheet, View, Alert, SafeAreaView, Platform } from 'react-native';
import { WebView } from 'react-native-webview';
import { StatusBar } from 'expo-status-bar';

export default function App() {
  const webViewRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);

  const handleNavigationStateChange = (navState) => {
    // Intercepta mudanças de navegação se necessário
    console.log('Navigation:', navState.url);
  };

  const handleError = (syntheticEvent) => {
    const { nativeEvent } = syntheticEvent;
    console.error('WebView error:', nativeEvent);
    Alert.alert('Erro de Conexão', 'Não foi possível carregar a aplicação. Verifique sua conexão.');
  };

  const handleLoadEnd = () => {
    setIsLoading(false);
  };

  // Injeta JavaScript para otimizar a experiência mobile
  const injectedJavaScript = `
    // Remove elementos que podem atrapalhar no mobile
    const style = document.createElement('style');
    style.textContent = \`
      body { 
        -webkit-user-select: none;
        -webkit-touch-callout: none;
        -webkit-tap-highlight-color: transparent;
      }
      * {
        -webkit-overflow-scrolling: touch;
      }
    \`;
    document.head.appendChild(style);
    
    // Previne zoom acidental
    document.addEventListener('gesturestart', function (e) {
      e.preventDefault();
    });
    
    true; // Necessário para o injectedJavaScript
  `;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" backgroundColor="#1f2937" />
      <WebView
        ref={webViewRef}
        source={{ uri: 'https://misterescuro.netlify.app/' }}
        style={styles.webview}
        onNavigationStateChange={handleNavigationStateChange}
        onError={handleError}
        onLoadEnd={handleLoadEnd}
        startInLoadingState={true}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        allowsBackForwardNavigationGestures={Platform.OS === 'ios'}
        // Configurações para manter sessão
        sharedCookiesEnabled={true}
        thirdPartyCookiesEnabled={true}
        // Otimizações para dashboard
        allowsInlineMediaPlayback={true}
        mediaPlaybackRequiresUserAction={false}
        // Injeta JS para melhorar UX mobile
        injectedJavaScript={injectedJavaScript}
        // Headers para identificar como mobile
        userAgent="MisterPix-Mobile/1.0"
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1f2937', // Cor do seu dashboard
    paddingTop: 20, // Adiciona padding top
  },
  webview: {
    flex: 1,
  },
});
