/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */
/// <reference path='realm.d.ts'/>

import React, {type PropsWithChildren} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

import Realm from 'realm';

class ChecklistItem {
  description!: string;
  completed!: boolean;
}

class Task {
  name!: string;
  age!: number;
  completed!: boolean;
  relatedTasks!: Task[];
  checklistItems!: ChecklistItem[];
}

const realm = new Realm({
  schema: [
    {
      name: 'Task',
      properties: {
        name: 'string',
        age: 'int',
        completed: 'bool',
        relatedTasks: 'Task[]',
        checklistItems: 'ChecklistItem[]',
      },
    },
    {
      name: 'ChecklistItem',
      properties: {
        description: 'string',
        completed: 'bool',
      },
    },
  ],
});

const randomString = () =>
  [...new Array(Math.floor(Math.random() * 30))]
    .map(() => String.fromCharCode(97 + Math.floor(Math.random() * 26)))
    .join('');

if (!realm.objects('Task').length) {
  let allChecklistItems = [];

  for (let i = 0; i < 100; i++) {
    realm.write(() => {
      const item = realm.create('ChecklistItem', {
        description: randomString(),
        completed: Math.random() > 0.5,
      });
      allChecklistItems.push(item);
    });
  }

  for (let i = 0; i < 100; i++) {
    realm.write(() => {
      realm.create('Task', {
        name: randomString(),
        age: Math.floor(Math.random() * 100),
        completed: Math.random() > 0.5,
        checklistItems: [...new Array(3)].map(
          () => allChecklistItems[Math.floor(Math.random() * 100)],
        ),
      });
    });
  }

  realm.objects('Task').forEach(task => {
    realm.write(() => {
      const relatedTasks = [...new Array(3)].map(
        () => realm.objects('Task')[Math.floor(Math.random() * 100)],
      );
      // console.log({relatedTasks});
      task.relatedTasks = relatedTasks;
    });
  });
}

const Section: React.FC<
  PropsWithChildren<{
    title: string;
  }>
> = ({children, title}) => {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? Colors.white : Colors.black,
          },
        ]}>
        {title}
      </Text>
      <Text
        style={[
          styles.sectionDescription,
          {
            color: isDarkMode ? Colors.light : Colors.dark,
          },
        ]}>
        {children}
      </Text>
    </View>
  );
};

const App = () => {
  const isDarkMode = useColorScheme() === 'dark';

  const nameQuery = 'abc 0.3';
  const ageQuery = 30;
  console.log(
    // realm.objects<Task>('Task'),
    realm.objects<Task>('Task'),
    // .filtered(t => t.checklistItems.any(i => i.description.startsWith('a'))),
    // .filtered(t => t.relatedTasks.any(r => r.age < 30)),
    // .filtered(t => t.age > 50 && t.age < 60 && t.completed),
    // .filtered(t => t.name.startsWith(nameQuery, true)), // && t.age > 30 && t.completed),
    // .filtered(t => t.name.like('*bc*3', true)),
    // .filtered(t => t.age < ageQuery),
  );
  // console.log(realm.objects('Task'));

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        <Header />
        <View
          style={{
            backgroundColor: isDarkMode ? Colors.black : Colors.white,
          }}>
          <Section title="Step One">
            Edit <Text style={styles.highlight}>App.tsx</Text> to change this
            screen and then come back to see your edits.
          </Section>
          <Section title="See Your Changes">
            <ReloadInstructions />
          </Section>
          <Section title="Debug">
            <DebugInstructions />
          </Section>
          <Section title="Learn More">
            Read the docs to discover what to do next:
          </Section>
          <LearnMoreLinks />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
