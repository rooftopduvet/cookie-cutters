def hello_world(name='World'):
    """Prints a hello message.

    Args:
        name (str, optional): Name to greet
    Returns:
        None

        Simply prints a hello message.
    """
    print(f'Hello {name}!')


if __name__ is '__main__':
    hello_world('World')