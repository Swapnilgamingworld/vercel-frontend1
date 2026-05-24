import { Link } from 'react-router-dom';
import './Breadcrumb.css';

export default function Breadcrumb({ items }) {
  return (
    <nav className="breadcrumb" aria-label="Breadcrumb">
      <ol>
        {items.map((item, index) => (
          <li key={index}>
            {item.path ? (
              <>
                <Link to={item.path}>{item.label}</Link>
                {index < items.length - 1 && <span className="breadcrumb-separator">/</span>}
              </>
            ) : (
              <>
                <span>{item.label}</span>
                {index < items.length - 1 && <span className="breadcrumb-separator">/</span>}
              </>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
