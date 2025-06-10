const cppConfig = {
    value: ['#include <iostream>', 'using namespace std;', 'int main', '{', '\tcout << "Hello World";', '\treturn 0;', '}'].join('\n'),
    language: 'cpp'
};

const textConfig = { 
    value : 'Input/Output Box',
    language : 'txt',
}

function getLanguage(language){
    switch(language){
        case "cpp": return cppConfig;
        case "text" : return textConfig;
        default : return textConfig;
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

