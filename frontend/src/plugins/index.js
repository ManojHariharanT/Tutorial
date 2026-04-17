import registry from "../config/LanguageRegistry.js";
import { sfLangPlugin } from "./sflangPlugin.js";
import { javascriptPlugin } from "./javascriptPlugin.js";

// Initialize registry
registry.register(sfLangPlugin);
registry.register(javascriptPlugin);

export { registry };
