type CardProps = {
    description: string;
    children: React.ReactNode;
    };
const HomeNavCard = ({description,children}: CardProps) => {
    return (
        <div className={`p-4 border rounded-b-lg shadow-md ${description}`}>
            <div>
                {children}
            </div>
        </div>
    )
}
export default HomeNavCard;