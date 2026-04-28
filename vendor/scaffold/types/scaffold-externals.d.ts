// reason: ambient declarations for third-party packages used by scaffold-b2b
// but not installed in launchpad — provides type stubs so scaffold code compiles

declare module "@headlessui/react" {
  import type { ComponentType, ReactNode } from "react";

  // reason: scaffold-b2b uses headlessui v2 which accepts className, as, data-*,
  // and other HTML attributes on slot components. We use a permissive base to avoid
  // stubbing every possible attribute combination.
  type HUIProps<SlotArgs = Record<string, never>> = {
    children?: ReactNode | ((bag: SlotArgs) => ReactNode);
    className?: string | ((bag: SlotArgs) => string);
    as?: React.ElementType;
    [key: string]: unknown;
  };

  // reason: onChange typed as (...args: any[]) => void because scaffold passes typed callbacks
  // (e.g. (value: Option) => void) which are contravariant-incompatible with (v: unknown) => void
  export const Listbox: ComponentType<HUIProps<{ value?: unknown; onChange?: (...args: any[]) => void; multiple?: boolean; disabled?: boolean }> & { value?: unknown; onChange?: (...args: any[]) => void; multiple?: boolean; disabled?: boolean }>;
  export const ListboxButton: ComponentType<HUIProps<{ open: boolean }>>;
  export const ListboxOption: ComponentType<HUIProps<{ value: unknown; disabled?: boolean; focus: boolean; selected: boolean }> & { value?: unknown; disabled?: boolean }>;
  export const ListboxOptions: ComponentType<HUIProps<{ static?: boolean }> & { static?: boolean }>;

  // reason: same contravariant callback issue as Listbox — see line 17
  export const Combobox: ComponentType<HUIProps<{ value?: unknown; onChange?: (...args: any[]) => void; multiple?: boolean; disabled?: boolean; nullable?: boolean; open?: boolean }> & { value?: unknown; onChange?: (...args: any[]) => void; multiple?: boolean; disabled?: boolean; nullable?: boolean }>;
  export const ComboboxInput: ComponentType<HUIProps<{ displayValue?: (...args: any[]) => string; onChange?: (...args: any[]) => void }> & { displayValue?: (...args: any[]) => string; onChange?: (...args: any[]) => void }>;
  export const ComboboxButton: ComponentType<HUIProps>;
  export const ComboboxOption: ComponentType<HUIProps<{ value: unknown; disabled?: boolean; focus: boolean; selected: boolean }> & { value?: unknown; disabled?: boolean }>;
  export const ComboboxOptions: ComponentType<HUIProps<{ static?: boolean }> & { static?: boolean }>;

  export const Menu: ComponentType<HUIProps>;
  export const MenuButton: ComponentType<HUIProps>;
  export const MenuItems: ComponentType<HUIProps<{ static?: boolean }> & { static?: boolean }>;
  export const MenuItem: ComponentType<HUIProps<{ focus: boolean; disabled?: boolean }>>;

  export const Popover: ComponentType<HUIProps>;
  export const PopoverButton: ComponentType<HUIProps>;
  export const PopoverPanel: ComponentType<HUIProps<{ static?: boolean }> & { static?: boolean; focus?: boolean }>;

  export const Dialog: ComponentType<HUIProps<{ open: boolean }> & { open?: boolean; onClose?: (value: boolean) => void; initialFocus?: React.RefObject<HTMLElement | null> }>;
  export const DialogPanel: ComponentType<HUIProps>;
  export const DialogTitle: ComponentType<HUIProps>;
  export const DialogBackdrop: ComponentType<HUIProps>;
  export const Description: ComponentType<HUIProps>;

  export const Transition: ComponentType<{
    show?: boolean;
    appear?: boolean;
    as?: React.ElementType;
    enter?: string;
    enterFrom?: string;
    enterTo?: string;
    leave?: string;
    leaveFrom?: string;
    leaveTo?: string;
    afterLeave?: () => void;
    children?: ReactNode;
    className?: string;
    [key: string]: unknown;
  }>;
  export const TransitionChild: ComponentType<{
    as?: React.ElementType;
    enter?: string;
    enterFrom?: string;
    enterTo?: string;
    leave?: string;
    leaveFrom?: string;
    leaveTo?: string;
    children?: ReactNode;
    className?: string;
    [key: string]: unknown;
  }>;
}

declare module "next/image" {
  import type { ComponentType, ImgHTMLAttributes } from "react";

  export interface ImageProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, "src"> {
    src: string | { src: string; height: number; width: number };
    alt: string;
    width?: number;
    height?: number;
    fill?: boolean;
    loader?: (p: { src: string; width: number; quality?: number }) => string;
    quality?: number;
    priority?: boolean;
    loading?: "lazy" | "eager";
    placeholder?: "blur" | "empty";
    blurDataURL?: string;
    sizes?: string;
    style?: React.CSSProperties;
    className?: string;
    onLoad?: (e: React.SyntheticEvent<HTMLImageElement>) => void;
    children?: React.ReactNode;
  }

  const NextImage: ComponentType<ImageProps>;
  export default NextImage;
}

declare module "next/link" {
  import type { ComponentType, AnchorHTMLAttributes, ReactNode } from "react";

  export interface LinkProps extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> {
    href: string | { pathname: string; query?: Record<string, string> };
    as?: string;
    replace?: boolean;
    scroll?: boolean;
    shallow?: boolean;
    passHref?: boolean;
    prefetch?: boolean;
    locale?: string | false;
    children?: ReactNode;
  }

  const NextLink: ComponentType<LinkProps>;
  export default NextLink;
}

declare module "next-cloudinary" {
  import type { ComponentType } from "react";

  export interface CldImageProps {
    src: string;
    alt?: string;
    width?: number | string;
    height?: number | string;
    crop?: string | Record<string, unknown>;
    gravity?: string;
    fillBackground?: boolean;
    sizes?: string;
    className?: string;
    title?: unknown;
    format?: string;
    quality?: string | number;
    aspectRatio?: string;
    fill?: boolean;
    [key: string]: unknown;
  }

  export const CldImage: ComponentType<CldImageProps>;
}

declare module "react-tooltip" {
  import type { ComponentType, ReactNode } from "react";

  export interface TooltipProps {
    id?: string;
    place?: "top" | "right" | "bottom" | "left";
    content?: ReactNode;
    className?: string;
    style?: React.CSSProperties;
    children?: ReactNode;
    [key: string]: unknown;
  }

  export const Tooltip: ComponentType<TooltipProps>;
}

declare module "react-loading-skeleton" {
  import type { ComponentType } from "react";

  export interface SkeletonProps {
    count?: number;
    duration?: number;
    width?: string | number;
    height?: string | number;
    circle?: boolean;
    className?: string;
    containerClassName?: string;
    style?: React.CSSProperties;
  }

  const Skeleton: ComponentType<SkeletonProps>;
  export default Skeleton;
  export type { SkeletonProps };
}

declare module "react-hot-toast" {
  import type { ComponentType, ReactNode } from "react";

  export interface ToastOptions {
    id?: string;
    duration?: number;
    position?: string;
    className?: string;
    style?: React.CSSProperties;
    icon?: ReactNode;
    [key: string]: unknown;
  }

  export interface Toast {
    id: string;
    message: ReactNode;
    type: string;
    visible: boolean;
    createdAt: number;
    [key: string]: unknown;
  }

  export interface ToasterProps {
    position?: string;
    toastOptions?: ToastOptions;
    children?: ReactNode | ((toast: Toast) => ReactNode);
    [key: string]: unknown;
  }

  export function toast(message: ReactNode, options?: ToastOptions): string;
  export namespace toast {
    function success(message: ReactNode, options?: ToastOptions): string;
    function error(message: ReactNode, options?: ToastOptions): string;
    function loading(message: ReactNode, options?: ToastOptions): string;
    function dismiss(toastId?: string): void;
    function remove(toastId?: string): void;
    function custom(renderer: (t: Toast) => ReactNode, options?: ToastOptions): string;
  }

  export const Toaster: ComponentType<ToasterProps>;
  export const ToastBar: ComponentType<{ toast: Toast; style?: React.CSSProperties; children?: (components: { icon: ReactNode; message: ReactNode }) => ReactNode; [key: string]: unknown }>;

  export default toast;
}

declare module "react-hook-form" {
  export interface UseFormReturn<T = Record<string, unknown>> {
    register: (name: string, options?: Record<string, unknown>) => Record<string, unknown>;
    handleSubmit: (onValid: (data: T) => void, onInvalid?: (errors: Record<string, unknown>) => void) => (e?: React.BaseSyntheticEvent) => Promise<void>;
    // reason: react-hook-form watch/getValues return the field's runtime type which varies per path
    watch: {
      (): T;
      (name: string): any;
      (names: string[]): any[];
    };
    setValue: (name: string, value: unknown) => void;
    getValues: {
      (): T;
      (name: string): any;
      (names: string[]): any[];
    };
    reset: (values?: Partial<T>) => void;
    formState: {
      errors: Record<string, { message?: string; type?: string }>;
      isValid: boolean;
      isDirty: boolean;
      isSubmitting: boolean;
      isSubmitted: boolean;
      touchedFields: Record<string, boolean>;
      dirtyFields: Record<string, boolean>;
    };
    control: unknown;
    clearErrors: (name?: string | string[]) => void;
    setError: (name: string, error: { type: string; message?: string }) => void;
    trigger: (name?: string | string[]) => Promise<boolean>;
  }

  export function useForm<T = Record<string, unknown>>(config?: Record<string, unknown>): UseFormReturn<T>;

  export const Controller: React.ComponentType<{
    name: string;
    control: unknown;
    rules?: Record<string, unknown>;
    defaultValue?: unknown;
    render: (props: { field: Record<string, unknown>; fieldState: Record<string, unknown> }) => React.ReactNode;
  }>;
}

declare module "isomorphic-dompurify" {
  export function sanitize(dirty: string, config?: Record<string, unknown>): string;
}

declare module "markdown" {
  interface MarkdownParser { toHTML(source: string): string }
  export const markdown: MarkdownParser;
}

declare module "date-fns" {
  export function format(date: Date | number, formatStr: string, options?: Record<string, unknown>): string;
}

declare module "swr" {
  import type { ComponentType, ReactNode } from "react";

  export interface SWRConfiguration {
    [key: string]: unknown;
  }

  export const SWRConfig: ComponentType<{ value: SWRConfiguration; children?: ReactNode }>;
  export function useSWRConfig(): { mutate: (key?: string | ((key: string) => boolean)) => void; cache: Map<string, unknown> };
}

declare module "react-modal" {
  import type { ComponentType, ReactNode } from "react";

  export interface Props {
    isOpen: boolean;
    onRequestClose?: () => void;
    className?: string | { base: string; afterOpen: string; beforeClose: string };
    overlayClassName?: string | { base: string; afterOpen: string; beforeClose: string };
    contentLabel?: string;
    style?: { content?: React.CSSProperties; overlay?: React.CSSProperties };
    shouldCloseOnOverlayClick?: boolean;
    shouldCloseOnEsc?: boolean;
    preventScroll?: boolean;
    children?: ReactNode;
    [key: string]: unknown;
  }

  const ReactModal: ComponentType<Props>;
  export default ReactModal;
}

declare module "react-slick" {
  import type { ReactNode } from "react";

  export interface Settings {
    dots?: boolean;
    infinite?: boolean;
    speed?: number;
    slidesToShow?: number;
    slidesToScroll?: number;
    arrows?: boolean;
    autoplay?: boolean;
    className?: string;
    beforeChange?: (current: number, next: number) => void;
    afterChange?: (current: number) => void;
    responsive?: Array<{ breakpoint: number; settings: Partial<Settings> | "unslick" }>;
    children?: ReactNode;
    [key: string]: unknown;
  }

  class Slider extends React.Component<Settings> {
    slickGoTo(slide: number, dontAnimate?: boolean): void;
    slickNext(): void;
    slickPrev(): void;
    slickPause(): void;
    slickPlay(): void;
  }
  export default Slider;
}

declare module "react-day-picker" {
  import type { ComponentType, ReactNode } from "react";

  export interface DateRange {
    from?: Date;
    to?: Date;
  }

  export interface DayPickerProps {
    mode?: "single" | "multiple" | "range";
    // reason: scaffold-b2b accesses .from/.to/.map/.toLocaleDateString without narrowing on mode
    selected?: any;
    onSelect?: (date: unknown) => void;
    disabled?: Array<Date | { from: Date; to: Date }> | ((date: Date) => boolean);
    fromDate?: Date;
    toDate?: Date;
    locale?: unknown;
    className?: string;
    classNames?: Record<string, string>;
    // reason: scaffold-b2b passes typed caption/row components
    components?: Record<string, ComponentType<any>>;
    children?: ReactNode;
    [key: string]: unknown;
  }

  export const DayPicker: ComponentType<DayPickerProps>;

  export interface CaptionProps {
    displayMonth: Date;
    id?: string;
  }

  export function useDayPicker(): { locale?: unknown; fromYear?: number; toYear?: number; fromDate?: Date; toDate?: Date; [key: string]: unknown };
  export function useNavigation(): { currentMonth: Date; goToMonth: (month: Date) => void; goToDate: (date: Date) => void; nextMonth?: Date; previousMonth?: Date };
}

declare module "next-client-cookies" {
  export function useCookies(): {
    get: (name: string) => string | undefined;
    set: (name: string, value: string, options?: Record<string, unknown>) => void;
    remove: (name: string) => void;
  };
}

declare module "next/headers" {
  export function cookies(): {
    get: (name: string) => { value: string } | undefined;
    getAll: () => Array<{ name: string; value: string }>;
    set: (name: string, value: string, options?: Record<string, unknown>) => void;
    delete: (name: string) => void;
    has: (name: string) => boolean;
  };
  export function headers(): {
    get: (name: string) => string | null;
    has: (name: string) => boolean;
    entries: () => IterableIterator<[string, string]>;
    forEach: (callback: (value: string, key: string) => void) => void;
  };
}

declare module "*.module.css" {
  const classes: Record<string, string>;
  export default classes;
}

// @shared/types — scaffold-b2b's shared type layer

declare module "@shared/types/product" {
  export interface Money { centAmount: number; currencyCode: string; fractionDigits: number }
  export interface Category { categoryId: string; name?: string; link?: string }
  export interface Variant { sku?: string; attributes?: Record<string, unknown>; images?: string[]; [k: string]: unknown }
  export interface Attributes { [key: string]: unknown }
  export interface Product { productId?: string; name?: string; variants?: Variant[]; categories?: Category[]; [k: string]: unknown }
}

declare module "@shared/types/product/Money" {
  export { Money } from "@shared/types/product";
}

declare module "@shared/types/product/Category" {
  export { Category } from "@shared/types/product";
}

declare module "@shared/types/product/Variant" {
  export { Variant } from "@shared/types/product";
}

declare module "@shared/types/cart" {
  export interface LineItem { lineItemId?: string; name?: string; count?: number; price?: unknown; variant?: { sku?: string; images?: string[]; [k: string]: unknown }; [k: string]: unknown }
  export interface Cart { cartId?: string; lineItems?: LineItem[]; sum?: unknown; shippingAddress?: unknown; billingAddress?: unknown; [k: string]: unknown }
  export interface Order { orderId?: string; orderState?: string; lineItems?: LineItem[]; sum?: unknown; [k: string]: unknown }
  export interface ShippingMethod { shippingMethodId?: string; name?: string; rates?: unknown[]; [k: string]: unknown }
}

declare module "@shared/types/cart/Cart" {
  export { Cart } from "@shared/types/cart";
}

declare module "@shared/types/cart/LineItem" {
  export { LineItem } from "@shared/types/cart";
}

declare module "@shared/types/cart/Order" {
  export { Order } from "@shared/types/cart";
}

declare module "@shared/types/account" {
  export interface Account { accountId?: string; email?: string; firstName?: string; lastName?: string; [k: string]: unknown }
  export interface Address { addressId?: string; firstName?: string; lastName?: string; streetName?: string; city?: string; country?: string; postalCode?: string; [k: string]: unknown }
}

declare module "@shared/types/account/Account" {
  export { Account } from "@shared/types/account";
}

declare module "@shared/types/account/Address" {
  export { Address } from "@shared/types/account";
}

declare module "@shared/types/business-unit" {
  export interface Associate { accountId?: string; email?: string; firstName?: string; lastName?: string; roles?: AssociateRole[]; [k: string]: unknown }
  export interface AssociateRole { key: string; name?: string; [k: string]: unknown }
  export interface BusinessUnit { businessUnitId?: string; key?: string; name?: string; associates?: Associate[]; stores?: unknown[]; [k: string]: unknown }
  export interface ApprovalRule { approvalRuleId?: string; name?: string; approvers?: unknown; [k: string]: unknown }
  export interface ApproverConjunction { and: ApproverDisjunction[] }
  export interface ApproverDisjunction { or: ApproverHierarchy[] }
  export interface ApproverHierarchy { associateRole: AssociateRole; [k: string]: unknown }
  export interface ApprovalFlow { approvalFlowId?: string; status?: string; order?: unknown; rules?: unknown[]; [k: string]: unknown }
  export type ApprovalFlowStatus = "Approved" | "Rejected" | "Pending" | string;
}

declare module "@shared/types/business-unit/BusinessUnit" {
  export { BusinessUnit } from "@shared/types/business-unit";
}

declare module "@shared/types/business-unit/Associate" {
  export { Associate } from "@shared/types/business-unit";
}

declare module "@shared/types/wishlist" {
  export interface Wishlist { wishlistId?: string; name?: string; lineItems?: WishlistLineItem[]; [k: string]: unknown }
  export interface WishlistLineItem { lineItemId?: string; productId?: string; name?: string; count?: number; [k: string]: unknown }
}

declare module "@shared/types/wishlist/Wishlist" {
  export { Wishlist } from "@shared/types/wishlist";
}

declare module "@shared/types/wishlist/LineItem" {
  import { WishlistLineItem } from "@shared/types/wishlist";
  export { WishlistLineItem as LineItem };
}

declare module "@shared/types/quote/Quote" {
  export interface Quote { quoteId?: string; quoteState?: string; [k: string]: unknown }
}

declare module "@shared/types/quote/QuoteRequest" {
  export interface QuoteRequest { quoteRequestId?: string; quoteRequestState?: string; [k: string]: unknown }
}

declare module "@shared/types/store" {
  export interface Store { storeId?: string; key?: string; name?: string; [k: string]: unknown }
}

declare module "@shared/types/result" {
  export interface PaginatedResult<T> { total?: number; count?: number; items: T[]; [k: string]: unknown }
}

declare module "@shared/types/ProjectSettings" {
  export interface ProjectSettings { projectKey?: string; name?: string; countries?: string[]; currencies?: string[]; languages?: string[]; [k: string]: unknown }
}

// @commercetools SDK stubs

declare module "@commercetools/frontend-sdk" {
  export interface SDKResponse<T = unknown> { isError: boolean; data: T; [k: string]: unknown }
  export interface ServerOptions { [k: string]: unknown }
}

declare module "@commercetools/frontend-sdk/lib/types/api/page" {
  export interface PageResponse { [k: string]: unknown }
}

declare module "@commercetools/checkout-browser-sdk" {
  export function paymentFlow(options: { projectKey: string; token: string; [k: string]: unknown }): { init(): void; [k: string]: unknown };
  const _default: { paymentFlow: typeof paymentFlow; [k: string]: unknown };
  export default _default;
}
