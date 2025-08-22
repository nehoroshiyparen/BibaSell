import type React from "react";

const PublicRoute = ({ children }: { children: React.ReactElement }) => {
    // Тут можно добавить проверку на аунтификацию. Но пока что не уверен, что она туту вообще нужна
    
    return children
}

export default PublicRoute