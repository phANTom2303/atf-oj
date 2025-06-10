export const fileTypes = {
    cpp:{
        templateCode:
        "#include <iostream>\nusing namespace std;\nint main(){\n\tcout <<\"Hello from CodeRun\"<< endl;\n\treturn 0;\n}",
    },
    java:{
        templateCode:
        "public class Main {\n\tpublic static void main(String[] args) {\n\t\tSystem.out.println(\"Hello from CodeRun\");\n\t}\n}",
    },
    python:{
        templateCode:
        "print(\"Hello from CodeRun\")",
    },
}