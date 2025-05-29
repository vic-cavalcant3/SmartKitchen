import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Platform,
  StatusBar,
  ScrollView,
  ActivityIndicator,
  Alert,
  Keyboard,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { GoogleGenerativeAI } from "@google/generative-ai";

const alturaStatusBar = StatusBar.currentHeight;
const KEY_GEMINI = "AIzaSyAc0pdpPaipsGPJ3j3ndEDC-UvksSCtzG8";
const genAI = new GoogleGenerativeAI(KEY_GEMINI);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 500,
  responseMimeType: "text/plain",
};

const Stack = createNativeStackNavigator();

function MenuPrincipal({ navigation }) {
  return (
    <View style={ESTILOS.menu}>
      <Text style={ESTILOS.header}>Cozinha Fácil</Text>
      <TouchableOpacity
        style={ESTILOS.menuBtn}
        onPress={() => navigation.navigate("Home")}
      >
        <Text style={ESTILOS.menuText}>Receita com Ingredientes</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={ESTILOS.menuBtn}
        onPress={() => navigation.navigate("BuscarPorNome")}
      >
        <Text style={ESTILOS.menuText}>Receitas </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={ESTILOS.menuBtn}
        onPress={() => navigation.navigate("Sobremesa")}
      >
        <Text style={ESTILOS.menuText}>Procure por Sobremesas</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={ESTILOS.menuBtn}
        onPress={() => navigation.navigate("Substituicao")}
      >
        <Text style={ESTILOS.menuText}>Substituição de incredientes</Text>
      </TouchableOpacity>
    </View>
  );
}

function HomeScreen() {
  const [load, setLoad] = useState(false);
  const [receita, setReceita] = useState("");
  const [tituloReceita, setTituloReceita] = useState("");
  const [ingr1, setIngr1] = useState("");
  const [ingr2, setIngr2] = useState("");
  const [ingr3, setIngr3] = useState("");
  const [ingr4, setIngr4] = useState("");
  const [ocasiao, setOcasiao] = useState("");

  async function gerarReceita() {
    if (!ingr1 || !ingr2 || !ingr3 || !ingr4 || !ocasiao) {
      Alert.alert("Atenção", "Informe todos os ingredientes!", [
        { text: "Beleza!" },
      ]);
      return;
    }
    setReceita("");
    setTituloReceita("");
    setLoad(true);
    Keyboard.dismiss();

    const prompt = `Sugira uma receita detalhada para o ${ocasiao} usando os ingredientes: ${ingr1}, ${ingr2}, ${ingr3} e ${ingr4}.`;

    try {
      const chatSession = model.startChat({ generationConfig, history: [] });
      const result = await chatSession.sendMessage(prompt);
      const resposta = result.response.text();
      const linhas = resposta.split("\n");
      const titulo = linhas[0];
      setTituloReceita(titulo);
      setReceita(resposta);
    } catch (error) {
      console.error(error);
    } finally {
      setLoad(false);
    }
  }

  return (
    <View style={ESTILOS.container}>
      <Text style={ESTILOS.header}>Receita com Ingredientes</Text>
      <View style={ESTILOS.form}>
        <Text style={ESTILOS.label}>Ingredientes:</Text>
        <TextInput
          placeholder="Ingrediente 1"
          style={ESTILOS.input}
          value={ingr1}
          onChangeText={setIngr1}
        />
        <TextInput
          placeholder="Ingrediente 2"
          style={ESTILOS.input}
          value={ingr2}
          onChangeText={setIngr2}
        />
        <TextInput
          placeholder="Ingrediente 3"
          style={ESTILOS.input}
          value={ingr3}
          onChangeText={setIngr3}
        />
        <TextInput
          placeholder="Ingrediente 4"
          style={ESTILOS.input}
          value={ingr4}
          onChangeText={setIngr4}
        />
        <TextInput
          placeholder="Almoço ou Jantar"
          style={ESTILOS.input}
          value={ocasiao}
          onChangeText={setOcasiao}
        />
        <TouchableOpacity style={ESTILOS.button} onPress={gerarReceita}>
          <Text style={ESTILOS.buttonText}>Gerar Receita</Text>
        </TouchableOpacity>
      </View>
      <ScrollView style={ESTILOS.containerScroll}>
        {load && <ActivityIndicator size="large" color="#000" />}
        {tituloReceita ? (
          <Text style={ESTILOS.title}>🍲 {tituloReceita}</Text>
        ) : null}
        {receita ? <Text style={ESTILOS.content}>{receita}</Text> : null}
      </ScrollView>
    </View>
  );
}

function TelaSobremesa() {
  const [sobremesa, setSobremesa] = useState("");
  const [tituloSobremesa, setTituloSobremesa] = useState("");
  const [load, setLoad] = useState(false);

  async function gerarSobremesa() {
    setSobremesa("");
    setTituloSobremesa("");
    setLoad(true);

    const prompt = "Sugira uma receita de sobremesa simples.";

    try {
      const chatSession = model.startChat({ generationConfig, history: [] });
      const result = await chatSession.sendMessage(prompt);
      const resposta = result.response.text();
      const linhas = resposta.split("\n");
      const titulo = linhas[0];
      setTituloSobremesa(titulo);
      setSobremesa(resposta);
    } catch (error) {
      console.error(error);
    } finally {
      setLoad(false);
    }
  }

  return (
    <View style={ESTILOS.container}>
      <Text style={ESTILOS.header}>Sobremesas 🍰</Text>
      <TouchableOpacity style={ESTILOS.button} onPress={gerarSobremesa}>
        <Text style={ESTILOS.buttonText}>Buscar Sobremesa</Text>
      </TouchableOpacity>
      <ScrollView style={ESTILOS.containerScroll}>
        {load && <ActivityIndicator size="large" color="#000" />}
        {tituloSobremesa && (
          <Text style={ESTILOS.title}>🍰 {tituloSobremesa}</Text>
        )}
        {sobremesa && <Text style={ESTILOS.content}>{sobremesa}</Text>}
      </ScrollView>
    </View>
  );
}

function TelaSubstituicao() {
  const [ingrediente, setIngrediente] = useState("");
  const [substituicao, setSubstituicao] = useState("");
  const [load, setLoad] = useState(false);

  async function buscarSubstituicao() {
    setSubstituicao("");
    setLoad(true);

    const prompt = `Qual é uma boa substituição para o ingrediente: ${ingrediente}?`;

    try {
      const chatSession = model.startChat({ generationConfig, history: [] });
      const result = await chatSession.sendMessage(prompt);
      const resposta = result.response.text();
      setSubstituicao(resposta);
    } catch (error) {
      console.error(error);
    } finally {
      setLoad(false);
    }
  }

  return (
    <View style={ESTILOS.container}>
      <Text style={ESTILOS.header}>Substituição de Ingredientes 🔁</Text>
      <TextInput
        placeholder="Ingrediente a ser substituído"
        style={ESTILOS.input}
        value={ingrediente}
        onChangeText={setIngrediente}
      />
      <TouchableOpacity style={ESTILOS.button} onPress={buscarSubstituicao}>
        <Text style={ESTILOS.buttonText}>Buscar Substituição</Text>
      </TouchableOpacity>
      <ScrollView style={ESTILOS.containerScroll}>
        {load && <ActivityIndicator size="large" color="#000" />}
        {substituicao && <Text style={ESTILOS.content}>{substituicao}</Text>}
      </ScrollView>
    </View>
  );
}

function TelaBuscarPorNome() {
  const [nomeReceita, setNomeReceita] = useState("");
  const [receitaEncontrada, setReceitaEncontrada] = useState("");
  const [load, setLoad] = useState(false);

  async function buscarReceitaPorNome() {
    setReceitaEncontrada("");
    setLoad(true);

    const prompt = `Encontre uma receita para: ${nomeReceita}`;

    try {
      const chatSession = model.startChat({ generationConfig, history: [] });
      const result = await chatSession.sendMessage(prompt);
      const resposta = result.response.text();
      setReceitaEncontrada(resposta);
    } catch (error) {
      console.error(error);
    } finally {
      setLoad(false);
    }
  }

  return (
    <View style={ESTILOS.container}>
      <Text style={ESTILOS.header}>Buscar Receita por Nome 🔍</Text>
      <TextInput
        placeholder="Nome da Receita"
        style={ESTILOS.input}
        value={nomeReceita}
        onChangeText={setNomeReceita}
      />
      <TouchableOpacity style={ESTILOS.button} onPress={buscarReceitaPorNome}>
        <Text style={ESTILOS.buttonText}>Buscar Receita</Text>
      </TouchableOpacity>
      <ScrollView style={ESTILOS.containerScroll}>
        {load && <ActivityIndicator size="large" color="#000" />}
        {receitaEncontrada && (
          <Text style={ESTILOS.content}>{receitaEncontrada}</Text>
        )}
      </ScrollView>
    </View>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="MenuPrincipal"
          component={MenuPrincipal}
          options={{ title: "Cozinha Fácil" }}
        />
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: "Receita por Ingredientes" }}
        />
        <Stack.Screen name="Sobremesa" component={TelaSobremesa} />
        <Stack.Screen name="Substituicao" component={TelaSubstituicao} />
        <Stack.Screen
          name="BuscarPorNome"
          component={TelaBuscarPorNome}
          options={{ title: "Buscar Receita por Nome" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const ESTILOS = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#B1D4E0",
    paddingTop: Platform.OS === "android" ? alturaStatusBar : 54,
    paddingHorizontal: 20,
  },
  header: {
    color: "#0C2D48",
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 20,
  },
  form: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
  },
  label: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 10,
    marginBottom: 10,
    fontSize: 16,
  },
  button: {
    backgroundColor: "#145DA0",
    padding: 14,
    borderRadius: 6,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
  },
  content: {
    fontSize: 16,
    lineHeight: 24,
    marginTop: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 20,
    textAlign: "center",
  },
  containerScroll: {
    marginTop: 16,
  },
  menu: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#B1D4E0",
    padding: 20,
  },
  menuBtn: {
    backgroundColor: "#145DA0",
    padding: 16,
    borderRadius: 8,
    marginVertical: 10,
    width: "60%",
    alignItems: "center",
  },
  menuText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  Textinput: {
    backgroundColor: "#fff"
  },
});
