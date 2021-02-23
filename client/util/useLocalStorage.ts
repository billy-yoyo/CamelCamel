import * as React from 'react';
import { Template } from 'tsplate';

export default <T>(key: string, template: Template<T, any>, initialValue?: T): [T, (value: T) => void] => {
    const [storedValue, setStoredValue] = React.useState(() => {
        try {
            const item = window.localStorage.getItem(key);
            let value = initialValue;
            if (item) {
                const parsed = JSON.parse(item);
                if (template.valid(parsed)) {
                    value = template.toModel(parsed);
                }
            }
            return value;
        } catch (error) {
            console.warn(error);
            return initialValue;
        }
    });

    const setValue = (value: T) => {
        try {
            setStoredValue(value);
            window.localStorage.setItem(key, JSON.stringify(template.toTransit(value)));
        } catch (error) {
            console.warn(error);
        }
    };

    return [storedValue, setValue];
}
