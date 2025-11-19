const MainLayout = ({
    header,
    footer,
    children,
}: {
    header?: React.ReactNode;
    footer?: React.ReactNode;
    children: React.ReactNode;
}) => {
    return (
        <div className="flex flex-col">
            {header}

            <div className="_container flex-1 flex justify-center">
                {children}
            </div>

            {footer}
        </div>
    );
};

export default MainLayout;