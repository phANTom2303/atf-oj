const cppConfig = {
    value: ['#include <iostream>', 'using namespace std;', 'int main', '{', '\tcout << "Hello World";', '\treturn 0;', '}'].join('\n'),
    language: 'cpp'
};

const javaConfig = {
    value: ['public class Main {', '\tpublic static void main(String[] args) {', '\t\tSystem.out.println("Hello World");', '\t}', '}'].join('\n'),
    language: 'java'
};

const pythonConfig = {
    value: 'print("Hello World")',
    language: 'python'
};

const txtConfig = { 
    value : '',
    language : 'txt',
}

function getLanguage(language){
    switch(language){
        case "cpp": return cppConfig;
        case "java" : return javaConfig;
        case "python" : return pythonConfig;
        default : return txtConfig;
    }
}

function getTheme(theme){
    if(theme == "dark"){
        return 'vs-dark';
    } else 
        return 'vs-light';
}

export default function getEditorOptions(language, theme, isReadOnly){
    const langConfig = getLanguage(language);
    return {
        ...langConfig,
        theme: getTheme(theme),
        readOnly: isReadOnly,
    };
}

