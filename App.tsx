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

import React from 'react';
import {View} from 'react-native';

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

const App = () => {
  const tasks = realm.objects<Task>('Task');

  // ---------------
  // Unary operators
  // ---------------
  // Simple queries with unary operators
  console.log(tasks.filtered(t => t.completed));
  // console.log(tasks.filtered("completed == true"));

  console.log(tasks.filtered(t => !t.completed));
  // console.log(tasks.filtered("completed == false"));

  // ----------------
  // Binary operators
  // ----------------
  console.log(tasks.filtered(t => t.age === 20));
  // console.log(tasks.filtered("age == 20"));

  console.log(tasks.filtered(t => t.age !== 20));
  // console.log(tasks.filtered("age != 20"));

  console.log(tasks.filtered(t => t.age > 20));
  // console.log(tasks.filtered("age > 20"));

  console.log(tasks.filtered(t => t.age < 20));
  // console.log(tasks.filtered("age < 20"));

  // ---------------
  // Using variables
  // ---------------
  const requestedAge = 30;
  console.log(tasks.filtered(t => t.age < requestedAge));
  // console.log(tasks.filtered("age < $0", requestedAge));

  // ----------------
  // String operators
  // ----------------
  console.log(tasks.filtered(t => t.name.startsWith('a')));
  // console.log(tasks.filtered("name BEGINSWITH \"a\""));

  console.log(tasks.filtered(t => t.name.contains('a')));
  // console.log(tasks.filtered("name CONTAINS \"a\""));

  console.log(tasks.filtered(t => t.name.endsWith('a')));
  // console.log(tasks.filtered("name ENDSWITH \"a\""));

  console.log(tasks.filtered(t => t.name.like('*a*')));
  // console.log(tasks.filtered("name LIKE \"*a*\""));

  console.log(tasks.filtered(t => t.name.startsWith('a', true)));
  // console.log(tasks.filtered("name BEGINSWITH[c] \"a\""));

  // -----------------
  // Logical operators
  // -----------------
  console.log(tasks.filtered(t => t.age > 20 && t.name.startsWith('a')));
  // console.log(tasks.filtered("(age > 20 && name BEGINSWITH \"a\")"));

  console.log(
    tasks.filtered(t => (t.age > 20 && t.name.startsWith('a')) || t.age < 80),
  );
  // console.log(tasks.filtered("((age > 20 && name BEGINSWITH \"a\") || age < 80)"));

  // --------------------
  // Collection operators
  // --------------------
  console.log(
    tasks.filtered(t => t.relatedTasks.any(r => r.name.startsWith('b'))),
  );
  // console.log(tasks.filtered("ANY relatedTasks.name BEGINSWITH \"b\""));

  console.log(tasks.filtered(t => t.relatedTasks.all(r => r.age > 30)));
  // console.log(tasks.filtered("ALL relatedTasks.age > 30"));

  console.log(tasks.filtered(t => t.checklistItems.all(c => c.completed)));
  // console.log(tasks.filtered("ALL checklistItems.completed == true"));

  // --------------------------------------------------------
  // Numerical operators on collections - not implemented yet
  // --------------------------------------------------------
  // console.log(tasks.filtered(t => t.relatedTasks.count() > 1));
  // console.log(tasks.filtered(t => t.relatedTasks.avg(r => r.age) > 10));

  return <View />;
};

export default App;
