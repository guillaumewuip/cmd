import classnames from "clsx";
import { ReactNode, ElementType, ComponentPropsWithoutRef } from "react";
import * as styles from "./Nav.css";

function Nav({ children }: { children: ReactNode[] }) {
  return (
    <nav>
      <ul className={styles.list}>{children}</ul>
    </nav>
  );
}

Nav.Item = function Item<T extends ElementType>({
  as: Component,
  children,
  active,
  ...props
}: {
  as?: T;
  children: ReactNode;
  active?: boolean;
} & Omit<ComponentPropsWithoutRef<T>, "as">) {
  const C = Component || "span";

  return (
    <li className={classnames(styles.item, { [styles.active]: active })}>
      <C className={styles.itemContent} {...props}>
        {children}
      </C>
    </li>
  );
};

export { Nav };
