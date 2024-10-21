


// types and interfaces
interface EachItemProps<T> {
    of : T[];
    render : (item : T, index : number) => JSX.Element;
}


export default function EachItem<T,>({ of, render } : EachItemProps<T>) {
    return <>{of.map((item, index) => render(item, index))}</>
}